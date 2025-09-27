import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResumeAnalyzerService } from './services/resume-analyzer.service';
import { JobMatcherService } from './services/job-matcher.service';
import { CoverLetterGeneratorService } from './services/cover-letter-generator.service';
import { ContentGeneratorService } from './services/content-generator.service';
import { AnalyzeResumeDto } from './dto/analyze-resume.dto';
import { JobMatchDto } from './dto/job-match.dto';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private configService: ConfigService,
    private resumeAnalyzer: ResumeAnalyzerService,
    private jobMatcher: JobMatcherService,
    private coverLetterGenerator: CoverLetterGeneratorService,
    private contentGenerator: ContentGeneratorService,
  ) {}

  async analyzeResume(analyzeResumeDto: AnalyzeResumeDto) {
    try {
      this.logger.log('Starting resume analysis...');
      
      const analysis = await this.resumeAnalyzer.analyzeResume(analyzeResumeDto);
      
      this.logger.log('Resume analysis completed successfully');
      return {
        success: true,
        data: analysis,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Resume analysis failed:', error);
      throw new BadRequestException('Failed to analyze resume');
    }
  }

  async matchJobs(jobMatchDto: JobMatchDto) {
    try {
      this.logger.log('Starting job matching...');
      
      const matches = await this.jobMatcher.findJobMatches(jobMatchDto);
      
      this.logger.log(`Found ${matches.length} job matches`);
      return {
        success: true,
        data: matches,
        count: matches.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Job matching failed:', error);
      throw new BadRequestException('Failed to match jobs');
    }
  }

  async generateCoverLetter(generateCoverLetterDto: GenerateCoverLetterDto) {
    try {
      this.logger.log('Generating cover letter...');
      
      const coverLetter = await this.coverLetterGenerator.generateCoverLetter(
        generateCoverLetterDto,
      );
      
      this.logger.log('Cover letter generated successfully');
      return {
        success: true,
        data: coverLetter,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Cover letter generation failed:', error);
      throw new BadRequestException('Failed to generate cover letter');
    }
  }

  async generateResumeContent(prompt: string, section: string) {
    try {
      this.logger.log(`Generating content for section: ${section}`);
      
      const content = await this.contentGenerator.generateContent(prompt, section);
      
      return {
        success: true,
        data: { content, section },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Content generation failed:', error);
      throw new BadRequestException('Failed to generate content');
    }
  }

  async improveSuggestions(resumeText: string, targetRole?: string) {
    try {
      this.logger.log('Generating improvement suggestions...');
      
      const suggestions = await this.contentGenerator.generateImprovements(
        resumeText,
        targetRole,
      );
      
      return {
        success: true,
        data: suggestions,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Improvement suggestions failed:', error);
      throw new BadRequestException('Failed to generate suggestions');
    }
  }

  async getAiStats() {
    return {
      services: {
        resumeAnalyzer: 'active',
        jobMatcher: 'active',
        coverLetterGenerator: 'active',
        contentGenerator: 'active',
      },
      config: {
        maxTokens: this.configService.get('ai.maxTokens'),
        temperature: this.configService.get('ai.temperature'),
        models: {
          deepseek: !!this.configService.get('ai.deepseekApiKey'),
          gemini: !!this.configService.get('ai.geminiApiKey'),
          openai: !!this.configService.get('ai.openaiApiKey'),
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}