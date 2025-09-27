import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface TemplateData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    title: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements?: string[];
    technologies?: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
}

@Injectable()
export class TemplateRendererService {
  private readonly logger = new Logger(TemplateRendererService.name);
  private readonly templatesPath: string;
  private compiledTemplates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private configService: ConfigService) {
    this.templatesPath = path.join(process.cwd(), 'templates');
    this.registerHelpers();
  }

  async renderTemplate(templateId: string, data: TemplateData): Promise<string> {
    try {
      this.logger.log(`Rendering template: ${templateId}`);

      // Use inline templates for now since external files might not exist
      const template = this.getInlineTemplate(templateId);
      
      const templateData = {
        ...data,
        formatDate: this.formatDate,
        formatPhone: this.formatPhone,
        generateId: () => Math.random().toString(36).substr(2, 9),
      };

      const html = template(templateData);

      this.logger.log(`Template rendered successfully: ${templateId}`);
      return html;
    } catch (error) {
      this.logger.error(`Template rendering failed for ${templateId}:`, error);
      throw error;
    }
  }

  private getInlineTemplate(templateId: string): HandlebarsTemplateDelegate {
    // Check if template is already compiled
    if (this.compiledTemplates.has(templateId)) {
      return this.compiledTemplates.get(templateId)!;
    }

    let templateSource = '';

    switch (templateId) {
      case 'ats-optimized':
      case 'ats-professional':
        templateSource = this.getATSOptimizedTemplate();
        break;
      case 'modern':
      case 'modern-gradient':
        templateSource = this.getModernTemplate();
        break;
      case 'classic':
        templateSource = this.getClassicTemplate();
        break;
      case 'creative':
        templateSource = this.getCreativeTemplate();
        break;
      default:
        templateSource = this.getATSOptimizedTemplate(); // fallback
    }

    const compiledTemplate = handlebars.compile(templateSource);
    this.compiledTemplates.set(templateId, compiledTemplate);
    
    return compiledTemplate;
  }

  private getATSOptimizedTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{personalInfo.firstName}} {{personalInfo.lastName}} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.4;
            color: #000;
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        
        .name {
            font-size: 24pt;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .title {
            font-size: 14pt;
            color: #555;
            margin-bottom: 10px;
        }
        
        .contact {
            font-size: 10pt;
            line-height: 1.2;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 1px solid #333;
            margin-bottom: 10px;
            padding-bottom: 2px;
        }
        
        .job, .education-item {
            margin-bottom: 15px;
        }
        
        .job-header, .edu-header {
            font-weight: bold;
        }
        
        .job-title {
            font-size: 12pt;
            font-weight: bold;
        }
        
        .company, .institution {
            font-style: italic;
        }
        
        .date-location {
            float: right;
            font-size: 10pt;
            color: #666;
        }
        
        .description ul {
            margin-left: 20px;
            margin-top: 5px;
        }
        
        .skills-list {
            columns: 2;
            column-gap: 30px;
        }
        
        .skill-item {
            margin-bottom: 5px;
            break-inside: avoid;
        }
        
        @media print {
            body { margin: 0; padding: 0.5in; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">{{personalInfo.firstName}} {{personalInfo.lastName}}</div>
        <div class="title">{{personalInfo.title}}</div>
        <div class="contact">
            {{personalInfo.email}} | {{formatPhone personalInfo.phone}} | {{personalInfo.location}}
            {{#if personalInfo.linkedin}} | LinkedIn: {{personalInfo.linkedin}}{{/if}}
            {{#if personalInfo.website}} | {{personalInfo.website}}{{/if}}
        </div>
    </div>

    {{#if summary}}
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <p>{{summary}}</p>
    </div>
    {{/if}}

    {{#if experience}}
    <div class="section">
        <div class="section-title">Professional Experience</div>
        {{#each experience}}
        <div class="job">
            <div class="job-header">
                <span class="job-title">{{position}}</span>
                <span class="date-location">{{formatDate startDate}} - {{#if current}}Present{{else}}{{formatDate endDate}}{{/if}} | {{location}}</span>
            </div>
            <div class="company">{{company}}</div>
            <div class="description">
                {{{description}}}
                {{#if achievements}}
                <ul>
                    {{#each achievements}}
                    <li>{{this}}</li>
                    {{/each}}
                </ul>
                {{/if}}
            </div>
        </div>
        {{/each}}
    </div>
    {{/if}}

    {{#if education}}
    <div class="section">
        <div class="section-title">Education</div>
        {{#each education}}
        <div class="education-item">
            <div class="edu-header">
                <span class="degree">{{degree}}</span>
                <span class="date-location">{{formatDate startDate}} - {{formatDate endDate}} | {{location}}</span>
            </div>
            <div class="institution">{{institution}}</div>
            {{#if gpa}}<div class="gpa">GPA: {{gpa}}</div>{{/if}}
        </div>
        {{/each}}
    </div>
    {{/if}}

    {{#if skills}}
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills-list">
            {{#each skills}}
            <div class="skill-item">• {{this}}</div>
            {{/each}}
        </div>
    </div>
    {{/if}}
</body>
</html>
    `;
  }

  private getModernTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{personalInfo.firstName}} {{personalInfo.lastName}} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: #333;
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            margin: -0.5in -0.5in 30px -0.5in;
            text-align: center;
        }
        
        .name {
            font-size: 28pt;
            font-weight: 300;
            margin-bottom: 8px;
        }
        
        .title {
            font-size: 16pt;
            font-weight: 300;
            opacity: 0.9;
            margin-bottom: 15px;
        }
        
        .contact {
            font-size: 11pt;
            opacity: 0.8;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 16pt;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 15px;
            position: relative;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 50px;
            height: 2px;
            background: #667eea;
        }
        
        .job, .education-item {
            margin-bottom: 20px;
            padding: 15px;
            border-left: 3px solid #667eea;
            background: #f8f9ff;
        }
        
        .job-title {
            font-size: 13pt;
            font-weight: 600;
            color: #333;
        }
        
        .company, .institution {
            font-weight: 500;
            color: #667eea;
            margin: 3px 0;
        }
        
        .date-location {
            font-size: 10pt;
            color: #666;
            float: right;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
        }
        
        .skill-item {
            background: #f0f2ff;
            padding: 8px 12px;
            border-radius: 20px;
            text-align: center;
            font-size: 10pt;
            color: #667eea;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">{{personalInfo.firstName}} {{personalInfo.lastName}}</div>
        <div class="title">{{personalInfo.title}}</div>
        <div class="contact">
            {{personalInfo.email}} • {{formatPhone personalInfo.phone}} • {{personalInfo.location}}
            {{#if personalInfo.linkedin}} • {{personalInfo.linkedin}}{{/if}}
        </div>
    </div>

    <!-- Rest similar to ATS template but with modern styling -->
    <!-- ... -->
</body>
</html>
    `;
  }

  private getClassicTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Times, serif;
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 3px double #000;
            padding-bottom: 15px;
        }
        
        .name {
            font-size: 22pt;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1px solid #000;
            margin: 20px 0 10px 0;
            padding-bottom: 3px;
        }
        
        /* Classic styling continues... */
    </style>
</head>
<body>
    <!-- Classic template content -->
</body>
</html>
    `;
  }

  private getCreativeTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .sidebar {
            background: #2c3e50;
            color: white;
            padding: 40px 30px;
            width: 35%;
            float: left;
            min-height: 100vh;
        }
        
        .main-content {
            padding: 40px;
            width: 65%;
            float: right;
        }
        
        /* Creative styling continues... */
    </style>
</head>
<body>
    <!-- Creative template content -->
</body>
</html>
    `;
  }

  private registerHelpers() {
    handlebars.registerHelper('formatDate', (date: string) => {
      if (!date) return '';
      try {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
      } catch {
        return date;
      }
    });

    handlebars.registerHelper('formatPhone', (phone: string) => {
      if (!phone) return '';
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      }
      return phone;
    });

    handlebars.registerHelper('if_eq', function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    });
  }

  private formatDate(date: string): string {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return date;
    }
  }

  private formatPhone(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  async getAvailableTemplates(): Promise<string[]> {
    return ['ats-optimized', 'modern', 'classic', 'creative'];
  }
}