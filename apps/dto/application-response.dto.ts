import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus, TimelineEventType, ReminderType } from './create-application.dto';

export class ContactResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class TimelineEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: TimelineEventType })
  type: TimelineEventType;

  @ApiProperty()
  date: string;

  @ApiProperty()
  description: string;

  @ApiPropertyOptional()
  details?: any;

  @ApiProperty()
  createdAt: string;
}

export class ReminderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ReminderType })
  type: ReminderType;

  @ApiProperty()
  date: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  completed: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class JobSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  location: string;

  @ApiPropertyOptional()
  url?: string;

  @ApiPropertyOptional()
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
}

export class ResumeSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}

export class ApplicationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  jobId: string;

  @ApiProperty()
  resumeId: string;

  @ApiPropertyOptional()
  coverLetterId?: string;

  @ApiProperty({ enum: ApplicationStatus })
  status: ApplicationStatus;

  @ApiProperty()
  appliedAt: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  sourceUrl?: string;

  @ApiPropertyOptional()
  expectedSalary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };

  @ApiProperty({ type: [ContactResponseDto] })
  contacts: ContactResponseDto[];

  @ApiProperty({ type: [TimelineEventResponseDto] })
  timeline: TimelineEventResponseDto[];

  @ApiProperty({ type: [ReminderResponseDto] })
  reminders: ReminderResponseDto[];

  @ApiPropertyOptional({ type: JobSummaryDto })
  job?: JobSummaryDto;

  @ApiPropertyOptional({ type: ResumeSummaryDto })
  resume?: ResumeSummaryDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  userId: string;

  // Computed fields
  @ApiPropertyOptional()
  daysSinceApplied?: number;

  @ApiPropertyOptional()
  nextReminder?: ReminderResponseDto;

  @ApiPropertyOptional()
  latestActivity?: TimelineEventResponseDto;

  @ApiPropertyOptional()
  primaryContact?: ContactResponseDto;
}

export class ApplicationListResponseDto {
  @ApiProperty({ type: [ApplicationResponseDto] })
  applications: ApplicationResponseDto[];

  @ApiProperty()
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiPropertyOptional()
  filters?: {
    status?: ApplicationStatus;
    company?: string;
    dateFrom?: string;
    dateTo?: string;
  };

  @ApiPropertyOptional()
  summary?: {
    totalApplications: number;
    byStatus: Record<ApplicationStatus, number>;
    recentActivity: number;
    upcomingReminders: number;
  };
}

export class ApplicationStatsResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  applied: number;

  @ApiProperty()
  interviews: number;

  @ApiProperty()
  offers: number;

  @ApiProperty()
  rejected: number;

  @ApiProperty()
  responseRate: number;

  @ApiProperty()
  avgResponseTime: number;

  @ApiProperty()
  conversionRate: {
    applicationToInterview: number;
    interviewToOffer: number;
  };

  @ApiProperty()
  monthlyTrend: Array<{
    month: string;
    applications: number;
    interviews: number;
    offers: number;
  }>;

  @ApiProperty()
  topCompanies: Array<{
    company: string;
    count: number;
  }>;

  @ApiProperty()
  averageTimeToResponse: {
    days: number;
    breakdown: {
      interview: number;
      offer: number;
      rejection: number;
    };
  };
}

export class BulkOperationResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  updatedCount: number;

  @ApiProperty()
  failedCount: number;

  @ApiPropertyOptional()
  errors?: Array<{
    applicationId: string;
    error: string;
  }>;

  @ApiPropertyOptional()
  message?: string;
}
