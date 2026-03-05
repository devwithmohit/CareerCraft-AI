// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyzeResumeDto } from '../dto/analyze-resume.dto';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class ResumeAnalyzerService {
  private readonly logger = new Logger(ResumeAnalyzerService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('ai.geminiApiKey');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async analyzeResume(analyzeResumeDto: AnalyzeResumeDto) {
    const { resumeText, jobDescription, analysisType } = analyzeResumeDto;

    // Extract text from PDF if needed
    let textContent = resumeText;
    if (analyzeResumeDto.resumeFile) {
      textContent = await this.extractTextFromPdf(analyzeResumeDto.resumeFile);
    }

    // Perform different types of analysis
    const analysisResults = await Promise.all([
      this.calculateATSScore(textContent, jobDescription),
      this.analyzeKeywords(textContent, jobDescription),
      this.checkStructure(textContent),
      this.analyzeSkills(textContent),
      this.generateImprovements(textContent, jobDescription),
    ]);

    return {
      atsScore: analysisResults[0],
      keywords: analysisResults[1],
      structure: analysisResults[2],
      skills: analysisResults[3],
      improvements: analysisResults[4],
      summary: this.generateSummary(analysisResults),
      analysisType,
      processedAt: new Date().toISOString(),
    };
  }

  private async calculateATSScore(resumeText: string, jobDescription?: string): Promise<number> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const prompt = `
        Analyze this resume for ATS compatibility and give it a score from 0-100.
        Consider: formatting, keywords, structure, completeness, and relevance.
        ${jobDescription ? `Job Description: ${jobDescription}` : ''}
        
        Resume: ${resumeText}
        
        Return only a JSON object with:
        {
          "score": number (0-100),
          "breakdown": {
            "formatting": number,
            "keywords": number,
            "structure": number,
            "completeness": number,
            "relevance": number
          },
          "reasoning": "brief explanation"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, ''));
        return parsed.score || 0;
      } catch {
        // Fallback scoring algorithm
        return this.fallbackATSScore(resumeText, jobDescription);
      }
    } catch (error) {
      this.logger.error('ATS scoring failed:', error);
      return this.fallbackATSScore(resumeText, jobDescription);
    }
  }

  private async analyzeKeywords(resumeText: string, jobDescription?: string) {
    if (!jobDescription) {
      return { matched: [], missing: [], total: 0 };
    }

    // Extract keywords from job description
    const jobKeywords = this.extractKeywords(jobDescription);
    const resumeKeywords = this.extractKeywords(resumeText);

    const matched = jobKeywords.filter(keyword => 
      resumeKeywords.some(rk => rk.toLowerCase().includes(keyword.toLowerCase()))
    );

    const missing = jobKeywords.filter(keyword => 
      !matched.some(mk => mk.toLowerCase() === keyword.toLowerCase())
    );

    return {
      matched,
      missing: missing.slice(0, 10), // Top 10 missing keywords
      total: jobKeywords.length,
      matchPercentage: Math.round((matched.length / jobKeywords.length) * 100),
    };
  }

  private async checkStructure(resumeText: string) {
    const sections = {
      contact: /contact|email|phone|address/i.test(resumeText),
      summary: /summary|objective|profile/i.test(resumeText),
      experience: /experience|employment|work|job/i.test(resumeText),
      education: /education|degree|university|college/i.test(resumeText),
      skills: /skills|technical|technologies|proficiencies/i.test(resumeText),
    };

    const presentSections = Object.values(sections).filter(Boolean).length;
    const totalSections = Object.keys(sections).length;

    return {
      sections,
      completeness: Math.round((presentSections / totalSections) * 100),
      recommendations: this.getStructureRecommendations(sections),
    };
  }

  private async analyzeSkills(resumeText: string) {
    const technicalSkills = this.extractTechnicalSkills(resumeText);
    const softSkills = this.extractSoftSkills(resumeText);

    return {
      technical: technicalSkills,
      soft: softSkills,
      total: technicalSkills.length + softSkills.length,
      recommendations: this.getSkillRecommendations(technicalSkills, softSkills),
    };
  }

  private async generateImprovements(resumeText: string, jobDescription?: string) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const prompt = `
        Analyze this resume and provide specific improvement suggestions.
        ${jobDescription ? `Target Job: ${jobDescription}` : ''}
        
        Resume: ${resumeText}
        
        Provide 5-7 actionable improvements in JSON format:
        {
          "improvements": [
            {
              "category": "formatting|content|keywords|structure",
              "priority": "high|medium|low",
              "suggestion": "specific improvement",
              "impact": "expected benefit"
            }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, ''));
        return parsed.improvements || [];
      } catch {
        return this.getFallbackImprovements();
      }
    } catch (error) {
      this.logger.error('Improvement generation failed:', error);
      return this.getFallbackImprovements();
    }
  }

  // Helper methods
  private async extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      this.logger.error('PDF text extraction failed:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - can be enhanced with NLP libraries
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    // Remove common words and return unique keywords
    const commonWords = ['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time'];
    return [...new Set(words.filter(word => !commonWords.includes(word)))];
  }

  private extractTechnicalSkills(text: string): string[] {
    const techSkills = [
      'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB',
      'AWS', 'Docker', 'Kubernetes', 'Git', 'TypeScript', 'Angular', 'Vue.js',
      'Machine Learning', 'AI', 'Data Science', 'DevOps', 'Cloud Computing'
    ];
    
    return techSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private extractSoftSkills(text: string): string[] {
    const softSkills = [
      'Leadership', 'Communication', 'Problem Solving', 'Team Player',
      'Critical Thinking', 'Creativity', 'Adaptability', 'Time Management'
    ];
    
    return softSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private fallbackATSScore(resumeText: string, jobDescription?: string): number {
    let score = 0;
    
    // Basic scoring based on presence of key sections
    if (/contact|email|phone/i.test(resumeText)) score += 15;
    if (/experience|work|employment/i.test(resumeText)) score += 25;
    if (/education|degree/i.test(resumeText)) score += 15;
    if (/skills|technical/i.test(resumeText)) score += 20;
    if (/summary|objective/i.test(resumeText)) score += 10;
    
    // Bonus for job description matching
    if (jobDescription) {
      const keywords = this.extractKeywords(jobDescription);
      const matches = keywords.filter(keyword => 
        resumeText.toLowerCase().includes(keyword.toLowerCase())
      );
      score += Math.min(15, (matches.length / keywords.length) * 15);
    }
    
    return Math.min(100, score);
  }

  private getStructureRecommendations(sections: any): string[] {
    const recommendations = [];
    
    if (!sections.contact) recommendations.push('Add clear contact information');
    if (!sections.summary) recommendations.push('Include a professional summary');
    if (!sections.experience) recommendations.push('Add work experience section');
    if (!sections.education) recommendations.push('Include education details');
    if (!sections.skills) recommendations.push('Add a skills section');
    
    return recommendations;
  }

  private getSkillRecommendations(technical: string[], soft: string[]): string[] {
    const recommendations = [];
    
    if (technical.length < 5) recommendations.push('Add more technical skills relevant to your field');
    if (soft.length < 3) recommendations.push('Include soft skills like leadership and communication');
    
    return recommendations;
  }

  private getFallbackImprovements() {
    return [
      {
        category: 'formatting',
        priority: 'high',
        suggestion: 'Use consistent formatting throughout the resume',
        impact: 'Improves readability and ATS compatibility'
      },
      {
        category: 'content',
        priority: 'high',
        suggestion: 'Add quantifiable achievements with numbers and percentages',
        impact: 'Makes your accomplishments more impactful'
      },
      {
        category: 'keywords',
        priority: 'medium',
        suggestion: 'Include relevant industry keywords from job descriptions',
        impact: 'Increases chances of passing ATS screening'
      }
    ];
  }

  private generateSummary(analysisResults: any[]) {
    const [atsScore] = analysisResults;
    
    if (atsScore >= 80) {
      return 'Excellent resume with strong ATS compatibility';
    } else if (atsScore >= 60) {
      return 'Good resume with room for improvement';
    } else {
      return 'Resume needs significant improvements for better ATS performance';
    }
  }
}