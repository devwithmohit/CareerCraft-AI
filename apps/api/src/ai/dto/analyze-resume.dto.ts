import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export enum AnalysisType {
  COMPREHENSIVE = 'comprehensive',
  ATS_SCORE = 'ats_score',
  KEYWORDS = 'keywords',
  STRUCTURE = 'structure',
  IMPROVEMENTS = 'improvements',
}

export class AnalyzeResumeDto {
  @ApiProperty({
    description: 'Resume text content',
    example: 'John Doe\nSoftware Engineer\n...',
  })
  @IsString()
  @IsNotEmpty()
  resumeText: string;

  @ApiPropertyOptional({
    description: 'Job description to compare against',
    example: 'We are looking for a Software Engineer with React experience...',
  })
  @IsOptional()
  @IsString()
  jobDescription?: string;

  @ApiPropertyOptional({
    enum: AnalysisType,
    description: 'Type of analysis to perform',
    default: AnalysisType.COMPREHENSIVE,
  })
  @IsOptional()
  @IsEnum(AnalysisType)
  analysisType?: string = AnalysisType.COMPREHENSIVE;

  @ApiPropertyOptional({
    description: 'Resume file buffer (for PDF uploads)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  resumeFile?: Buffer;

  @ApiPropertyOptional({
    description: 'Target role or position',
    example: 'Senior React Developer',
  })
  @IsOptional()
  @IsString()
  targetRole?: string;

  @ApiPropertyOptional({
    description: 'Industry or field',
    example: 'Technology',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    description: 'Experience level',
    example: 'Senior',
  })
  @IsOptional()
  @IsString()
  experienceLevel?: string;
}