import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ResumeAnalyzerService } from './services/resume-analyzer.service';
import { JobMatcherService } from './services/job-matcher.service';
import { CoverLetterGeneratorService } from './services/cover-letter-generator.service';
import { ContentGeneratorService } from './services/content-generator.service';
import { DatabaseModule } from '../database/database.module';
import aiConfig from '../config/ai.config';

@Module({
  imports: [
    ConfigModule.forFeature(aiConfig),
    DatabaseModule,
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed!'), false);
        }
      },
    }),
  ],
  controllers: [AiController],
  providers: [
    AiService,
    ResumeAnalyzerService,
    JobMatcherService,
    CoverLetterGeneratorService,
    ContentGeneratorService,
  ],
  exports: [AiService],
})
export class AiModule {}