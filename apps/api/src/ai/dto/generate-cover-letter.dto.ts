import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum CoverLetterTone {
  PROFESSIONAL = 'professional',
  ENTHUSIASTIC = 'enthusiastic',
  CONFIDENT = 'confident',
  CONVERSATIONAL = 'conversational',
  FORMAL = 'formal',
}

export enum CoverLetterLength {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
}

export class GenerateCoverLetterDto {
  @ApiProperty({
    description: 'Resume text content',
    example: 'John Doe\nSoftware Engineer...',
  })
  @IsString()
  @IsNotEmpty()
  resumeText: string;

  @ApiProperty({
    description: 'Job description',
    example: 'We are seeking a talented Software Engineer...',
  })
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Tech Corp Inc.',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'Position title',
    example: 'Senior React Developer',
  })
  @IsString()
  @IsNotEmpty()
  positionTitle: string;

  @ApiPropertyOptional({
    description: 'Hiring manager name',
    example: 'Sarah Johnson',
  })
  @IsOptional()
  @IsString()
  hiringManagerName?: string;

  @ApiPropertyOptional({
    enum: CoverLetterTone,
    description: 'Tone of the cover letter',
    default: CoverLetterTone.PROFESSIONAL,
  })
  @IsOptional()
  @IsEnum(CoverLetterTone)
  tone?: CoverLetterTone = CoverLetterTone.PROFESSIONAL;

  @ApiPropertyOptional({
    enum: CoverLetterLength,
    description: 'Length of the cover letter',
    default: CoverLetterLength.MEDIUM,
  })
  @IsOptional()
  @IsEnum(CoverLetterLength)
  length?: CoverLetterLength = CoverLetterLength.MEDIUM;

  @ApiPropertyOptional({
    description: 'Key points to highlight',
    example: ['5 years React experience', 'Led team of 10 developers', 'Increased performance by 40%'],
  })
  @IsOptional()
  @IsString({ each: true })
  keyPoints?: string[];

  @ApiPropertyOptional({
    description: 'Company information or research',
    example: 'I admire your company commitment to innovation...',
  })
  @IsOptional()
  @IsString()
  companyResearch?: string;

  @ApiPropertyOptional({
    description: 'Specific skills to emphasize',
    example: ['React', 'TypeScript', 'Team Leadership'],
  })
  @IsOptional()
  @IsString({ each: true })
  skillsToEmphasize?: string[];

  @ApiPropertyOptional({
    description: 'Personal motivation or interest',
    example: 'Passionate about creating user-friendly applications',
  })
  @IsOptional()
  @IsString()
  personalMotivation?: string;
}