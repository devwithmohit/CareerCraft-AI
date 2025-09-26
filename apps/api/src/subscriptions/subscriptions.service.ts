import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/database.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { StripeWebhookDto } from './dto/stripe-webhook.dto';
import Stripe from 'stripe';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('stripe.secretKey'), {
      apiVersion: '2023-10-16',
    });
  }

  async createSubscription(userId: string, createSubscriptionDto: CreateSubscriptionDto) {
    const { plan, paymentMethodId } = createSubscriptionDto;

    try {
      // Check if user already has an active subscription
      const existingSubscription = await this.prisma.subscription.findUnique({
        where: { userId },
      });

      if (existingSubscription && existingSubscription.status === 'ACTIVE') {
        throw new ConflictException('User already has an active subscription');
      }

      // Get user details
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Create or retrieve Stripe customer
      let customerId = await this.getOrCreateStripeCustomer(user);

      // Attach payment method to customer
      if (paymentMethodId) {
        await this.stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });

        // Set as default payment method
        await this.stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      // Get price ID based on plan
      const priceId = this.getPriceId(plan);

      // Create Stripe subscription
      const stripeSubscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Create or update subscription in database
      const subscription = await this.prisma.subscription.upsert({
        where: { userId },
        update: {
          plan,
          status: 'TRIAL',
          stripeId: stripeSubscription.id,
        },
        create: {
          userId,
          plan,
          status: 'TRIAL',
          stripeId: stripeSubscription.id,
        },
      });

      return {
        subscription,
        clientSecret: (stripeSubscription.latest_invoice as Stripe.Invoice)
          ?.payment_intent?.client_secret,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(skip = 0, take = 10) {
    const subscriptions = await this.prisma.subscription.findMany({
      skip,
      take,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.subscription.count();

    return {
      subscriptions,
      pagination: {
        total,
        pages: Math.ceil(total / take),
        currentPage: Math.floor(skip / take) + 1,
        limit: take,
      },
    };
  }

  async findOne(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    // Get Stripe subscription details
    if (subscription.stripeId) {
      try {
        const stripeSubscription = await this.stripe.subscriptions.retrieve(
          subscription.stripeId,
          { expand: ['latest_invoice', 'customer'] }
        );

        return {
          ...subscription,
          stripeDetails: {
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            trialEnd: stripeSubscription.trial_end 
              ? new Date(stripeSubscription.trial_end * 1000) 
              : null,
          },
        };
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    return subscription;
  }

  async findByUserId(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!subscription) {
      return null;
    }

    return this.findOne(subscription.id);
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (!subscription.stripeId) {
      throw new BadRequestException('No Stripe subscription found');
    }

    try {
      // Cancel Stripe subscription at period end
      await this.stripe.subscriptions.update(subscription.stripeId, {
        cancel_at_period_end: true,
      });

      // Update status in database
      const updatedSubscription = await this.prisma.subscription.update({
        where: { userId },
        data: { status: 'CANCELED' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return updatedSubscription;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async resumeSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.stripeId) {
      throw new NotFoundException('Subscription not found');
    }

    try {
      // Resume Stripe subscription
      await this.stripe.subscriptions.update(subscription.stripeId, {
        cancel_at_period_end: false,
      });

      // Update status in database
      const updatedSubscription = await this.prisma.subscription.update({
        where: { userId },
        data: { status: 'ACTIVE' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return updatedSubscription;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  async handleStripeWebhook(signature: string, payload: Buffer) {
    const endpointSecret = this.configService.get('stripe.webhookSecret');

    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw new BadRequestException('Invalid webhook signature');
    }
  }

  private async getOrCreateStripeCustomer(user: any): Promise<string> {
    // Check if user already has a Stripe customer ID
    const customers = await this.stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0].id;
    }

    // Create new Stripe customer
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      metadata: {
        userId: user.id,
      },
    });

    return customer.id;
  }

  private getPriceId(plan: string): string {
    const priceIds = {
      PRO: this.configService.get('stripe.proPriceId'),
      ENTERPRISE: this.configService.get('stripe.enterprisePriceId'),
    };

    const priceId = priceIds[plan];
    if (!priceId) {
      throw new BadRequestException(`Invalid plan: ${plan}`);
    }

    return priceId;
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeId: stripeSubscription.id },
    });

    if (subscription) {
      const status = this.mapStripeStatus(stripeSubscription.status);
      
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status },
      });
    }
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeId: stripeSubscription.id },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'CANCELED' },
      });
    }
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const subscription = await this.prisma.subscription.findFirst({
        where: { stripeId: invoice.subscription as string },
      });

      if (subscription) {
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'ACTIVE' },
        });
      }
    }
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    if (invoice.subscription) {
      const subscription = await this.prisma.subscription.findFirst({
        where: { stripeId: invoice.subscription as string },
      });

      if (subscription) {
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' },
        });
      }
    }
  }

  private mapStripeStatus(stripeStatus: string): string {
    const statusMap = {
      'active': 'ACTIVE',
      'trialing': 'TRIAL',
      'past_due': 'EXPIRED',
      'canceled': 'CANCELED',
      'unpaid': 'EXPIRED',
      'incomplete': 'TRIAL',
      'incomplete_expired': 'EXPIRED',
    };

    return statusMap[stripeStatus] || 'EXPIRED';
  }
}