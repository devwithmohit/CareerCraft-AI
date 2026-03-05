// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import { TemplateRendererService } from './template-renderer.service';

export interface PdfOptions {
  format?: 'A4' | 'Letter';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  displayHeaderFooter?: boolean;
  headerTemplate?: string;
  footerTemplate?: string;
  printBackground?: boolean;
}

@Injectable()
export class PdfGeneratorService {
  private readonly logger = new Logger(PdfGeneratorService.name);

  constructor(
    private configService: ConfigService,
    private templateRenderer: TemplateRendererService,
  ) {}

  async generatePdfFromHtml(
    html: string,
    options: PdfOptions = {},
  ): Promise<Buffer> {
    let browser: puppeteer.Browser | null = null;

    try {
      this.logger.log('Starting PDF generation...');

      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      const pdfOptions: puppeteer.PDFOptions = {
        format: options.format || 'A4',
        printBackground: options.printBackground ?? true,
        margin: options.margin || {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in',
        },
        displayHeaderFooter: options.displayHeaderFooter || false,
        headerTemplate: options.headerTemplate || '',
        footerTemplate: options.footerTemplate || '',
      };

      const pdfBuffer = await page.pdf(pdfOptions);

      this.logger.log('PDF generated successfully');
      return pdfBuffer;
    } catch (error) {
      this.logger.error('PDF generation failed:', error);
      throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  async generateResumeAsPdf(
    resumeData: any,
    templateId: string,
    options: PdfOptions = {},
  ): Promise<Buffer> {
    try {
      this.logger.log(`Generating PDF resume with template: ${templateId}`);

      const html = await this.templateRenderer.renderTemplate(
        templateId,
        resumeData,
      );

      const pdfBuffer = await this.generatePdfFromHtml(html, options);

      return pdfBuffer;
    } catch (error) {
      this.logger.error('Resume PDF generation failed:', error);
      throw error;
    }
  }

  async generateMultipleFormats(
    resumeData: any,
    templateId: string,
    formats: string[],
  ): Promise<{ [format: string]: Buffer }> {
    const results: { [format: string]: Buffer } = {};

    for (const format of formats) {
      try {
        switch (format.toLowerCase()) {
          case 'pdf':
            results.pdf = await this.generateResumeAsPdf(resumeData, templateId);
            break;
          case 'html':
            const html = await this.templateRenderer.renderTemplate(
              templateId,
              resumeData,
            );
            results.html = Buffer.from(html, 'utf-8');
            break;
        }
      } catch (error) {
        this.logger.error(`Failed to generate ${format}:`, error);
      }
    }

    return results;
  }
}