import { ApiProperty } from '@nestjs/swagger';

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
}

export class Subscription {
  @ApiProperty({ example: 'clr1234567890' })
  id: string;

  @ApiProperty({ example: 'clr1234567890' })
  userId: string;

  @ApiProperty({ enum: SubscriptionPlan, example: SubscriptionPlan.PRO })
  plan: SubscriptionPlan;

  @ApiProperty({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  status: SubscriptionStatus;

  @ApiProperty({ example: 'sub_1234567890', required: false })
  stripeId?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;

  // Relations
  user?: any;
}
