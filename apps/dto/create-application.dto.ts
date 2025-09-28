import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEmail,
  IsDateString,
  IsBoolean,
  MinLength,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ApplicationStatus {
  DRAFT = 'draft',
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

export enum TimelineEventType {
  APPLIED = 'applied',
  RESPONSE = 'response',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTION = 'rejection',
  FOLLOW_UP = 'follow-up',
  NOTE = 'note',
}

export enum ReminderType {
  FOLLOW_UP = 'follow-up',
  INTERVIEW = 'interview',
  CUSTOM = 'custom',
}

class CreateContactDto {
  @ApiProperty({ description: 'Contact person name' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Contact person email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contact person role/position' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  role: string;

  @ApiPropertyOptional({ description: 'Additional notes about contact' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

class CreateTimelineEventDto {
  @ApiProperty({
    description: 'Type of timeline event',
    enum: TimelineEventType
  })
  @IsEnum(TimelineEventType)
  type: TimelineEventType;

  @ApiProperty({ description: 'Event date' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Event description' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  description: string;

  @ApiPropertyOptional({ description: 'Additional event details' })
  @IsOptional()
  details?: any;
}

class CreateReminderDto {
  @ApiProperty({
    description: 'Type of reminder',
    enum: ReminderType
  })
  @IsEnum(ReminderType)
  type: ReminderType;

  @ApiProperty({ description: 'Reminder date' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Reminder message' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  message: string;

  @ApiPropertyOptional({ description: 'Whether reminder is completed' })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

export class CreateApplicationDto {
  @ApiProperty({ description: 'Job ID this application is for' })
  @IsString()
  jobId: string;

  @ApiProperty({ description: 'Resume ID used for this application' })
  @IsString()
  resumeId: string;

  @ApiPropertyOptional({ description: 'Cover letter ID used for this application' })
  @IsOptional()
  @IsString()
  coverLetterId?: string;

  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    default: ApplicationStatus.DRAFT
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiProperty({ description: 'Date when application was submitted' })
  @IsDateString()
  appliedAt: string;

  @ApiPropertyOptional({ description: 'Application notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({
    description: 'Contact persons for this application',
    type: [CreateContactDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContactDto)
  contacts?: CreateContactDto[];

  @ApiPropertyOptional({
    description: 'Timeline events for this application',
    type: [CreateTimelineEventDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTimelineEventDto)
  timeline?: CreateTimelineEventDto[];

  @ApiPropertyOptional({
    description: 'Reminders for this application',
    type: [CreateReminderDto]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReminderDto)
  reminders?: CreateReminderDto[];

  @ApiPropertyOptional({ description: 'Application source URL' })
  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @ApiPropertyOptional({ description: 'Expected salary range' })
  @IsOptional()
  expectedSalary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'hourly' | 'monthly' | 'yearly';
  };
}
