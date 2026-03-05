// @ts-nocheck
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Headers,
  RawBody,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { StripeWebhookDto } from './dto/stripe-webhook.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 409, description: 'User already has an active subscription' })
  create(
    @CurrentUser('id') userId: string,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(userId, createSubscriptionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscriptions (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully' })
  @Roles('admin')
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.subscriptionsService.findAll(skip, limit);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({ status: 200, description: 'Subscription retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  findMine(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.findByUserId(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get subscription by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Subscription found' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel current user subscription' })
  @ApiResponse({ status: 200, description: 'Subscription canceled successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @HttpCode(HttpStatus.OK)
  cancel(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.cancelSubscription(userId);
  }

  @Post('resume')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resume current user subscription' })
  @ApiResponse({ status: 200, description: 'Subscription resumed successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @HttpCode(HttpStatus.OK)
  resume(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.resumeSubscription(userId);
  }

  @Post('webhooks/stripe')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @RawBody() payload: Buffer,
  ) {
    return this.subscriptionsService.handleStripeWebhook(signature, payload);
  }
}