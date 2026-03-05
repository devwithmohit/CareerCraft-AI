import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export class CreateSubscriptionDto {
  @ApiProperty({
    enum: SubscriptionPlan,
    example: SubscriptionPlan.PRO,
    description: 'Subscription plan type'
  })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @ApiProperty({
    example: 'pm_1234567890',
    description: 'Stripe payment method ID',
    required: false
  })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiProperty({
    example: 'monthly',
    description: 'Billing interval (monthly or yearly)',
    required: false,
    default: 'monthly'
  })
  @IsOptional()
  @IsString()
  interval?: string;
}
