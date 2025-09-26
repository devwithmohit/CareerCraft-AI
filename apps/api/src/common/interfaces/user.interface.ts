import { SubscriptionPlan, SubscriptionStatus } from '../../subscriptions/entities/subscription.entity';

export interface IUser {
  id: string;
  kindeId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserWithSubscription extends IUser {
  subscription?: ISubscription;
}

export interface IUserWithStats extends IUserWithSubscription {
  stats: IUserStats;
}

export interface ISubscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserStats {
  totalResumes: number;
  totalApplications: number;
  applicationsByStatus: IApplicationStatusCount[];
  recentActivity: IRecentActivity[];
}

export interface IApplicationStatusCount {
  status: ApplicationStatus;
  _count: number;
}

export interface IRecentActivity {
  id: string;
  title: string;
  updatedAt: Date;
  type?: 'resume' | 'application' | 'interview';
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  INTERVIEWING = 'INTERVIEWING',
  OFFERED = 'OFFERED',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

export interface IResume {
  id: string;
  userId: string;
  title: string;
  content: any; // JSON content
  template: string;
  atsScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplication {
  id: string;
  userId: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  appliedAt: Date;
  updatedAt: Date;
}

// JWT Payload Interface
export interface IJwtPayload {
  sub: string; // User ID
  kindeId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Kinde User Payload Interface
export interface IKindeUserPayload {
  sub: string; // Kinde user ID
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
  aud?: string[];
  exp?: number;
  iat?: number;
  iss?: string;
}

// Auth Response Interface
export interface IAuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

// User Role Interface (for future role-based access control)
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface IUserWithRole extends IUser {
  role?: UserRole;
}

// API Response Interfaces
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface IApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

// Filter Interfaces
export interface IUserFilters {
  email?: string;
  firstName?: string;
  lastName?: string;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  createdAfter?: Date;
  createdBefore?: Date;
}

// Create/Update Interfaces
export interface ICreateUser {
  kindeId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface IUpdateUser {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Subscription Interfaces
export interface IStripeCustomer {
  id: string;
  email: string;
  name?: string;
  created: number;
}

export interface ISubscriptionDetails extends ISubscription {
  stripeDetails?: {
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEnd?: Date;
  };
}