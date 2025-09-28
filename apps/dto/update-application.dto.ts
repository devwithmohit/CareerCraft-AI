import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateApplicationDto,
  ApplicationStatus,
  CreateContactDto,
  CreateTimelineEventDto,
  CreateReminderDto
} from './create-application.dto';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
  MaxLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @ApiPropertyOptional({
    description: 'Updated application status',
    enum: ApplicationStatus
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Updated application notes' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ description: 'Updated application date' })
  @IsOptional()
  @IsDateString()
  appliedAt?: string;

  @ApiPropertyOptional({ description: 'Updated resume ID' })
  @IsOptional()
  @IsString()
  resumeId?: string;

  @ApiPropertyOptional({ description: 'Updated cover letter ID' })
  @IsOptional()
  @IsString()
  coverLetterId?: string;

  @ApiPropertyOptional({ description: 'Updated source URL' })
  @IsOptional()
  @IsString()
  sourceUrl?: string;

  @ApiPropertyOptional({ description: 'Updated expected salary' })
  @IsOptional()
  expectedSalary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'hourly' | 'monthly' | 'yearly';
  };
}

// Specialized DTOs for specific updates
export class UpdateApplicationStatusDto {
  @ApiPropertyOptional({
    description: 'New application status',
    enum: ApplicationStatus
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Optional note about status change' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  statusNote?: string;
}

export class AddTimelineEventDto {
  @ApiPropertyOptional({ description: 'Timeline event to add' })
  @ValidateNested()
  @Type(() => CreateTimelineEventDto)
  event: CreateTimelineEventDto;
}

export class AddReminderDto {
  @ApiPropertyOptional({ description: 'Reminder to add' })
  @ValidateNested()
  @Type(() => CreateReminderDto)
  reminder: CreateReminderDto;
}

export class UpdateReminderDto {
  @ApiPropertyOptional({ description: 'Updated reminder message' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  message?: string;

  @ApiPropertyOptional({ description: 'Updated reminder date' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: 'Mark reminder as completed' })
  @IsOptional()
  completed?: boolean;
}

export class AddContactDto {
  @ApiPropertyOptional({ description: 'Contact to add' })
  @ValidateNested()
  @Type(() => CreateContactDto)
  contact: CreateContactDto;
}

export class BulkUpdateApplicationsDto {
  @ApiPropertyOptional({ description: 'Array of application IDs to update' })
  @IsArray()
  @IsString({ each: true })
  applicationIds: string[];

  @ApiPropertyOptional({
    description: 'New status for all applications',
    enum: ApplicationStatus
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({ description: 'Tags to add to all applications' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Note to add to all applications' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
