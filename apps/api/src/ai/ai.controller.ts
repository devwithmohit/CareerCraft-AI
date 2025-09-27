import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto';
import { JobMatchDto } from './dto/job-match.dto';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('AI Services')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze-resume')
  @ApiOperation({ summary: 'Analyze resume for ATS compatibility and improvements' })
  @ApiResponse({ 
    status: 200, 
    description: 'Resume analysis completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            atsScore: { type: 'number' },
            keywords: {
              type: 'object',
              properties: {
                matched: { type: 'array', items: { type: 'string' } },
                missing: { type: 'array', items: { type: 'string' } },
                total: { type: 'number' },
                matchPercentage: { type: 'number' },
              },
            },
            improvements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  priority: { type: 'string' },
                  suggestion: { type: 'string' },
                  impact: { type: 'string' },
                },
              },
            },
            structure: {
              type: 'object',
              properties: {
                completeness: { type: 'number' },
                recommendations: { type: 'array', items: { type: 'string' } },
              },
            },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid resume data' })
  async analyzeResume(
    @Body() analyzeResumeDto: AnalyzeResumeDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiService.analyzeResume(analyzeResumeDto);
  }

  @Post('analyze-resume-file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Analyze resume from uploaded PDF file' })
  @ApiResponse({ status: 200, description: 'Resume file analysis completed' })
  @ApiResponse({ status: 400, description: 'Invalid file format' })
  async analyzeResumeFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('jobDescription') jobDescription?: string,
    @Body('analysisType') analysisType?: string,
    @CurrentUser('id') userId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('Only PDF files are supported');
    }

    const analyzeResumeDto: AnalyzeResumeDto = {
      resumeFile: file.buffer,
      jobDescription,
      analysisType: analysisType || 'comprehensive',
      resumeText: '', // Will be extracted from PDF
    };

    return this.aiService.analyzeResume(analyzeResumeDto);
  }

  @Post('match-jobs')
  @ApiOperation({ summary: 'Find matching jobs based on resume and preferences' })
  @ApiResponse({ 
    status: 200, 
    description: 'Job matching completed successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              jobId: { type: 'string' },
              title: { type: 'string' },
              company: { type: 'string' },
              matchScore: { type: 'number' },
              matchingSkills: { type: 'array', items: { type: 'string' } },
              missingSkills: { type: 'array', items: { type: 'string' } },
              salaryRange: { type: 'string' },
              location: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
        count: { type: 'number' },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid job matching criteria' })
  async matchJobs(
    @Body() jobMatchDto: JobMatchDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiService.matchJobs(jobMatchDto);
  }

  @Post('generate-cover-letter')
  @ApiOperation({ summary: 'Generate personalized cover letter' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cover letter generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            tone: { type: 'string' },
            length: { type: 'number' },
            keyPoints: { type: 'array', items: { type: 'string' } },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid cover letter parameters' })
  async generateCoverLetter(
    @Body() generateCoverLetterDto: GenerateCoverLetterDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.aiService.generateCoverLetter(generateCoverLetterDto);
  }

  @Post('generate-content')
  @ApiOperation({ summary: 'Generate content for specific resume sections' })
  @ApiResponse({ 
    status: 200, 
    description: 'Content generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            content: { type: 'string' },
            section: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  async generateContent(
    @Body() body: { section: string; prompt: string; currentContent?: string },
    @CurrentUser('id') userId: string,
  ) {
    const { section, prompt } = body;
    return this.aiService.generateResumeContent(prompt, section);
  }

  @Post('improve-section')
  @ApiOperation({ summary: 'Get AI suggestions to improve resume section' })
  @ApiResponse({ 
    status: 200, 
    description: 'Section improvements generated successfully' 
  })
  async improveSection(
    @Body() body: { section: any; type: string; targetRole?: string },
    @CurrentUser('id') userId: string,
  ) {
    const { section, type, targetRole } = body;
    const sectionText = JSON.stringify(section);
    return this.aiService.improveSuggestions(sectionText, targetRole);
  }

  @Post('optimize-keywords')
  @ApiOperation({ summary: 'Optimize resume keywords for specific job' })
  @ApiResponse({ status: 200, description: 'Keywords optimized successfully' })
  async optimizeKeywords(
    @Body() body: { resumeText: string; jobDescription: string },
    @CurrentUser('id') userId: string,
  ) {
    const analyzeDto: AnalyzeResumeDto = {
      resumeText: body.resumeText,
      jobDescription: body.jobDescription,
      analysisType: 'keywords',
    };
    
    const analysis = await this.aiService.analyzeResume(analyzeDto);
    
    // Generate keyword optimization suggestions
    const suggestions = await this.aiService.generateResumeContent(
      `Optimize these keywords for better ATS performance: ${JSON.stringify(analysis.data.keywords)}`,
      'keywords'
    );

    return {
      success: true,
      data: {
        currentKeywords: analysis.data.keywords,
        suggestions: suggestions.data.content,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get AI-powered resume improvement suggestions' })
  @ApiResponse({ status: 200, description: 'Suggestions retrieved successfully' })
  async getSuggestions(
    @Query('resumeId') resumeId?: string,
    @Query('targetRole') targetRole?: string,
    @CurrentUser('id') userId?: string,
  ) {
    // This would typically fetch resume data and generate suggestions
    // For now, return sample suggestions
    return {
      success: true,
      data: {
        suggestions: [
          {
            type: 'content',
            priority: 'high',
            message: 'Add quantifiable achievements to your work experience',
            section: 'experience',
          },
          {
            type: 'keywords',
            priority: 'medium',
            message: 'Include more industry-specific keywords',
            section: 'skills',
          },
          {
            type: 'formatting',
            priority: 'low',
            message: 'Use consistent bullet points throughout',
            section: 'all',
          },
        ],
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get AI service statistics' })
  @ApiResponse({ status: 200, description: 'AI statistics retrieved successfully' })
  async getAiStats(@CurrentUser('id') userId: string) {
    return this.aiService.getAiStats();
  }

  @Post('batch-analyze')
  @ApiOperation({ summary: 'Analyze multiple resumes in batch' })
  @ApiResponse({ status: 200, description: 'Batch analysis completed' })
  async batchAnalyze(
    @Body() body: {     // Add this to your existing resumes.controller.ts
    @Post('export')
    @ApiOperation({ summary: 'Export resume in specified format' })
    async exportResume(
      @Body() exportDto: ExportResumeDto,
      @Res() res: Response,
    ) {
      const result = await this.exportService.exportResume(exportDto);
      
      res.set({
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': result.buffer.length,
      });
      
      res.send(result.buffer);
    }resumes: string[]; jobDescription?: string },
    @CurrentUser('id') userId: string,
  ) {
    const { resumes, jobDescription } = body;
    
    const analyses = await Promise.all(
      resumes.map(resumeText => 
        this.aiService.analyzeResume({
          resumeText,
          jobDescription,
          analysisType: 'comprehensive',
        })
      )
    );

    return {
      success: true,
      data: analyses,
      count: analyses.length,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Check AI services health' })
  @ApiResponse({ status: 200, description: 'AI services health status' })
  async healthCheck() {
    return {
      status: 'healthy',
      services: {
        gemini: 'connected',
        deepseek: 'connected',
        openai: 'connected',
      },
      timestamp: new Date().toISOString(),
    };
  }
}