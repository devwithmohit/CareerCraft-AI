import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ResumesController } from './resumes.controller';
import { ResumesService } from './resumes.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { TemplateRendererService } from './services/template-renderer.service';
import { ExportService } from './services/export.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [ResumesController],
  providers: [
    ResumesService,
    PdfGeneratorService,
    TemplateRendererService,
    ExportService,
  ],
  exports: [
    ResumesService,
    PdfGeneratorService,
    TemplateRendererService,
    ExportService,
  ],
})
export class ResumesModule {}