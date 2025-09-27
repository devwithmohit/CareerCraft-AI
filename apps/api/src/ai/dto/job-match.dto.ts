import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class JobMatchDto {
  @ApiProperty({
    description: 'Resume text or resume ID',
    example: 'John Doe\nSoftware Engineer...',
  })
  @IsString()
  @IsNotEmpty()
  resumeText: string;

  @ApiPropertyOptional({
    description: 'Preferred job titles',
    example: ['Software Engineer', 'Frontend Developer', 'React Developer'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredTitles?: string[];

  @ApiPropertyOptional({
    description: 'Preferred locations',
    example: ['San Francisco', 'New York', 'Remote'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLocations?: string[];

  @ApiPropertyOptional({
    description: 'Minimum salary expectation',
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minSalary?: number;

  @ApiPropertyOptional({
    description: 'Maximum salary expectation',
    example: 200000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxSalary?: number;

  @ApiPropertyOptional({
    description: 'Experience level',
    example: 'Senior',
  })
  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @ApiPropertyOptional({
    description: 'Required skills',
    example: ['React', 'TypeScript', 'Node.js'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredSkills?: string[];

  @ApiPropertyOptional({
    description: 'Preferred company size',
    example: 'Startup',
  })
  @IsOptional()
  @IsString()
  companySize?: string;

  @ApiPropertyOptional({
    description: 'Remote work preference',
    example: true,
  })
  @IsOptional()
  remoteWork?: boolean;

  @ApiPropertyOptional({
    description: 'Industry preferences',
    example: ['Technology', 'Finance', 'Healthcare'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  industries?: string[];

  @ApiPropertyOptional({
    description: 'Minimum match score threshold',
    example: 0.7,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  matchThreshold?: number = 0.7;

  @ApiPropertyOptional({
    description: 'Maximum number of job matches to return',
    example: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}