// @ts-nocheck
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PdfGeneratorService } from './pdf-generator.service';
import { TemplateRendererService } from './template-renderer.service';
import { ExportResumeDto } from '../dto/export-resume.dto';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    private pdfGenerator: PdfGeneratorService,
    private templateRenderer: TemplateRendererService,
  ) {}

  async exportResume(exportDto: ExportResumeDto): Promise<{
    buffer: Buffer;
    filename: string;
    mimeType: string;
  }> {
    const { resumeData, template, format, filename } = exportDto;

    try {
      this.logger.log(`Exporting resume as ${format} with template ${template}`);

      switch (format.toLowerCase()) {
        case 'pdf':
          return await this.exportAsPdf(resumeData, template, filename);
        case 'html':
          return await this.exportAsHtml(resumeData, template, filename);
        default:
          throw new BadRequestException(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      this.logger.error(`Export failed for format ${format}:`, error);
      throw error;
    }
  }

  private async exportAsPdf(
    resumeData: any,
    template: string,
    filename?: string,
  ): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
    const buffer = await this.pdfGenerator.generateResumeAsPdf(resumeData, template);
    
    return {
      buffer,
      filename: filename || `resume-${template}.pdf`,
      mimeType: 'application/pdf',
    };
  }

  private async exportAsHtml(
    resumeData: any,
    template: string,
    filename?: string,
  ): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
    const html = await this.templateRenderer.renderTemplate(template, resumeData);
    
    return {
      buffer: Buffer.from(html, 'utf-8'),
      filename: filename || `resume-${template}.html`,
      mimeType: 'text/html',
    };
  }
}