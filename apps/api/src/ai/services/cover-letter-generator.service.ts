// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateCoverLetterDto, CoverLetterTone, CoverLetterLength } from '../dto/generate-cover-letter.dto';
import { CoverLetterResponse } from '../interfaces/ai-response.interface';

@Injectable()
export class CoverLetterGeneratorService {
  private readonly logger = new Logger(CoverLetterGeneratorService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('ai.geminiApiKey');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateCoverLetter(generateCoverLetterDto: GenerateCoverLetterDto): Promise<CoverLetterResponse> {
    try {
      this.logger.log('Starting cover letter generation...');

      // Extract relevant information from resume
      const resumeAnalysis = await this.analyzeResumeForCoverLetter(generateCoverLetterDto.resumeText);
      
      // Generate cover letter using AI
      const coverLetterContent = await this.generateCoverLetterContent(
        generateCoverLetterDto,
        resumeAnalysis
      );

      // Post-process and format the cover letter
      const processedCoverLetter = this.processCoverLetter(
        coverLetterContent,
        generateCoverLetterDto
      );

      this.logger.log('Cover letter generation completed successfully');
      return processedCoverLetter;

    } catch (error) {
      this.logger.error('Cover letter generation failed:', error);
      throw error;
    }
  }

  private async generateCoverLetterContent(
    dto: GenerateCoverLetterDto,
    resumeAnalysis: any
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const prompt = this.buildCoverLetterPrompt(dto, resumeAnalysis);

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return response.trim();

    } catch (error) {
      this.logger.error('AI cover letter generation failed:', error);
      return this.generateFallbackCoverLetter(dto, resumeAnalysis);
    }
  }

  private buildCoverLetterPrompt(dto: GenerateCoverLetterDto, resumeAnalysis: any): string {
    const {
      resumeText,
      jobDescription,
      companyName,
      positionTitle,
      hiringManagerName,
      tone = CoverLetterTone.PROFESSIONAL,
      length = CoverLetterLength.MEDIUM,
      keyPoints = [],
      companyResearch,
      skillsToEmphasize = [],
      personalMotivation
    } = dto;

    const toneInstructions = this.getToneInstructions(tone);
    const lengthInstructions = this.getLengthInstructions(length);

    return `
Generate a compelling cover letter for the following job application:

CANDIDATE INFORMATION:
- Name: ${resumeAnalysis.personalInfo?.name || 'Candidate'}
- Current Role: ${resumeAnalysis.currentRole || 'Professional'}
- Years of Experience: ${resumeAnalysis.experience?.years || 'Several years'}
- Key Skills: ${resumeAnalysis.skills?.join(', ') || 'Various professional skills'}
- Notable Achievements: ${resumeAnalysis.achievements?.join(', ') || 'Strong track record'}

JOB INFORMATION:
- Position: ${positionTitle}
- Company: ${companyName}
- Hiring Manager: ${hiringManagerName || 'Hiring Manager'}
- Job Description: ${jobDescription}

REQUIREMENTS:
${toneInstructions}
${lengthInstructions}

KEY POINTS TO HIGHLIGHT:
${keyPoints.length > 0 ? keyPoints.map(point => `- ${point}`).join('\n') : '- Relevant experience and achievements from resume'}

SKILLS TO EMPHASIZE:
${skillsToEmphasize.length > 0 ? skillsToEmphasize.join(', ') : resumeAnalysis.skills?.slice(0, 5)?.join(', ')}

${companyResearch ? `COMPANY RESEARCH:\n${companyResearch}` : ''}

${personalMotivation ? `PERSONAL MOTIVATION:\n${personalMotivation}` : ''}

STRUCTURE:
1. Professional header with date and recipient information
2. Engaging opening paragraph that mentions the specific position
3. 1-2 body paragraphs highlighting relevant experience and achievements
4. Connection paragraph showing knowledge of the company and role alignment
5. Strong closing paragraph with call to action
6. Professional signature

GUIDELINES:
- Use specific examples and quantifiable achievements from the resume
- Show clear understanding of the job requirements
- Demonstrate enthusiasm for the role and company
- Maintain ATS-friendly formatting (avoid special characters, tables, or complex formatting)
- Use industry-relevant keywords from the job description
- Keep paragraphs concise and impactful
- Include a professional greeting and closing
- Ensure the letter flows naturally and tells a compelling story

Generate the complete cover letter now:
    `;
  }

  private getToneInstructions(tone: CoverLetterTone): string {
    const toneMap = {
      [CoverLetterTone.PROFESSIONAL]: 'Use a professional, business-appropriate tone. Be confident but not overly casual.',
      [CoverLetterTone.ENTHUSIASTIC]: 'Use an enthusiastic and energetic tone while maintaining professionalism. Show genuine excitement.',
      [CoverLetterTone.CONFIDENT]: 'Use a confident, assertive tone that showcases expertise and value proposition strongly.',
      [CoverLetterTone.CONVERSATIONAL]: 'Use a conversational, approachable tone while keeping it professional and engaging.',
      [CoverLetterTone.FORMAL]: 'Use a formal, traditional business tone with proper etiquette and conservative language.'
    };

    return `TONE: ${toneMap[tone]}`;
  }

  private getLengthInstructions(length: CoverLetterLength): string {
    const lengthMap = {
      [CoverLetterLength.SHORT]: 'Keep the letter concise - approximately 200-250 words, 3 paragraphs maximum.',
      [CoverLetterLength.MEDIUM]: 'Write a standard length letter - approximately 300-400 words, 4-5 paragraphs.',
      [CoverLetterLength.LONG]: 'Create a comprehensive letter - approximately 400-500 words, 5-6 paragraphs with detailed examples.'
    };

    return `LENGTH: ${lengthMap[length]}`;
  }

  private async analyzeResumeForCoverLetter(resumeText: string): Promise<any> {
    try {
      if (!this.genAI) {
        return this.fallbackResumeAnalysis(resumeText);
      }

      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const prompt = `
        Analyze this resume and extract key information for cover letter generation.
        
        Resume: ${resumeText}
        
        Return only a JSON object with:
        {
          "personalInfo": {
            "name": "Full Name",
            "email": "email@example.com",
            "phone": "phone number",
            "location": "City, State"
          },
          "currentRole": "Current or most recent job title",
          "experience": {
            "years": number,
            "level": "Entry|Mid|Senior|Executive",
            "companies": ["Company1", "Company2"],
            "industries": ["Industry1", "Industry2"]
          },
          "skills": ["skill1", "skill2", "skill3", ...],
          "achievements": [
            "Quantified achievement 1",
            "Quantified achievement 2",
            "Quantified achievement 3"
          ],
          "education": {
            "degree": "Highest degree",
            "institution": "University name",
            "field": "Field of study"
          },
          "certifications": ["cert1", "cert2"],
          "keyStrengths": ["strength1", "strength2", "strength3"]
        }
      `;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        return JSON.parse(response.replace(/```json|```/g, ''));
      } catch {
        return this.fallbackResumeAnalysis(resumeText);
      }

    } catch (error) {
      this.logger.error('Resume analysis for cover letter failed:', error);
      return this.fallbackResumeAnalysis(resumeText);
    }
  }

  private processCoverLetter(content: string, dto: GenerateCoverLetterDto): CoverLetterResponse {
    // Extract key points from the generated content
    const keyPoints = this.extractKeyPoints(content);
    
    // Identify personalizations made
    const personalizations = this.identifyPersonalizations(content, dto);
    
    // Generate suggestions for improvement
    const suggestions = this.generateSuggestions(content, dto);

    // Count words for length verification
    const wordCount = content.split(/\s+/).length;

    return {
      content: this.formatCoverLetter(content),
      tone: dto.tone || CoverLetterTone.PROFESSIONAL,
      length: wordCount,
      keyPoints,
      personalizations,
      suggestions
    };
  }

  private extractKeyPoints(content: string): string[] {
    const keyPoints = [];
    
    // Look for bullet points or numbered lists
    const bulletMatches = content.match(/[•\-\*]\s*([^\n]+)/g);
    if (bulletMatches) {
      keyPoints.push(...bulletMatches.map(match => match.replace(/[•\-\*]\s*/, '').trim()));
    }

    // Look for achievement patterns (numbers, percentages, etc.)
    const achievementMatches = content.match(/\b(?:\d+%|\$[\d,]+|\d+\+?\s*(?:years?|months?)|increased?|improved?|reduced?|managed?|led)\b[^.!?]*[.!?]/gi);
    if (achievementMatches) {
      keyPoints.push(...achievementMatches.map(match => match.trim()));
    }

    // Return unique key points, limited to 5
    return [...new Set(keyPoints)].slice(0, 5);
  }

  private identifyPersonalizations(content: string, dto: GenerateCoverLetterDto): string[] {
    const personalizations = [];

    if (content.includes(dto.companyName)) {
      personalizations.push(`Company name mentioned: ${dto.companyName}`);
    }

    if (content.includes(dto.positionTitle)) {
      personalizations.push(`Position title referenced: ${dto.positionTitle}`);
    }

    if (dto.hiringManagerName && content.includes(dto.hiringManagerName)) {
      personalizations.push(`Addressed to specific hiring manager: ${dto.hiringManagerName}`);
    }

    if (dto.companyResearch && content.toLowerCase().includes('research')) {
      personalizations.push('Company research incorporated');
    }

    if (dto.keyPoints && dto.keyPoints.some(point => content.includes(point))) {
      personalizations.push('Custom key points included');
    }

    return personalizations;
  }

  private generateSuggestions(content: string, dto: GenerateCoverLetterDto): string[] {
    const suggestions = [];

    // Check for quantified achievements
    if (!/\d+%|\$[\d,]+|\d+\s*(?:years?|months?)/.test(content)) {
      suggestions.push('Consider adding more quantified achievements and specific metrics');
    }

    // Check for company-specific mentions
    if (!content.toLowerCase().includes('company') && !content.includes(dto.companyName.toLowerCase())) {
      suggestions.push('Add more specific references to the company and its values');
    }

    // Check for call to action
    if (!/(interview|discuss|contact|hear from|look forward)/i.test(content)) {
      suggestions.push('Include a stronger call to action in the closing paragraph');
    }

    // Check for keywords from job description
    const jobKeywords = this.extractJobKeywords(dto.jobDescription);
    const usedKeywords = jobKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (usedKeywords.length < jobKeywords.length * 0.3) {
      suggestions.push('Incorporate more keywords from the job description');
    }

    // Check length appropriateness
    const wordCount = content.split(/\s+/).length;
    if (dto.length === CoverLetterLength.SHORT && wordCount > 300) {
      suggestions.push('Consider shortening the letter for better impact');
    } else if (dto.length === CoverLetterLength.LONG && wordCount < 350) {
      suggestions.push('Consider adding more detailed examples and achievements');
    }

    return suggestions;
  }

  private extractJobKeywords(jobDescription: string): string[] {
    // Extract important keywords from job description
    const text = jobDescription.toLowerCase();
    const words = text.split(/\W+/);
    
    // Common job-related keywords to look for
    const importantWords = words.filter(word => 
      word.length > 3 && 
      !['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'work', 'team', 'company'].includes(word)
    );

    // Return top keywords (remove duplicates)
    return [...new Set(importantWords)].slice(0, 10);
  }

  private formatCoverLetter(content: string): string {
    // Ensure proper formatting and structure
    let formatted = content.trim();

    // Add date if not present
    if (!formatted.includes(new Date().getFullYear().toString())) {
      const today = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      formatted = `${today}\n\n${formatted}`;
    }

    // Ensure proper paragraph spacing
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Ensure consistent greeting format
    formatted = formatted.replace(/dear\s+([^,\n]+)[,:]?\s*\n/i, 'Dear $1,\n\n');
    
    // Ensure proper closing
    if (!/(sincerely|regards|best)/i.test(formatted.split('\n').slice(-3).join(' '))) {
      formatted += '\n\nSincerely,\n[Your Name]';
    }

    return formatted;
  }

  private fallbackResumeAnalysis(resumeText: string): any {
    const text = resumeText.toLowerCase();
    
    // Extract basic information using regex patterns
    const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = resumeText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    
    // Extract skills
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'html', 'css',
      'typescript', 'angular', 'vue', 'docker', 'aws', 'git', 'mongodb', 'postgresql'
    ];
    const foundSkills = commonSkills.filter(skill => text.includes(skill));

    // Estimate experience level
    let experienceLevel = 'Mid';
    if (text.includes('senior') || text.includes('lead')) {
      experienceLevel = 'Senior';
    } else if (text.includes('junior') || text.includes('entry')) {
      experienceLevel = 'Entry';
    }

    return {
      personalInfo: {
        name: 'Professional',
        email: emailMatch ? emailMatch[0] : 'professional@email.com',
        phone: phoneMatch ? phoneMatch[0] : '',
        location: 'Location'
      },
      currentRole: 'Software Professional',
      experience: {
        years: 3,
        level: experienceLevel,
        companies: ['Previous Company'],
        industries: ['Technology']
      },
      skills: foundSkills,
      achievements: [
        'Contributed to successful project deliveries',
        'Collaborated with cross-functional teams',
        'Maintained high code quality standards'
      ],
      education: {
        degree: 'Bachelor\'s Degree',
        institution: 'University',
        field: 'Computer Science'
      },
      certifications: [],
      keyStrengths: ['Technical Skills', 'Problem Solving', 'Team Collaboration']
    };
  }

  private generateFallbackCoverLetter(dto: GenerateCoverLetterDto, resumeAnalysis: any): string {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `${today}

Dear ${dto.hiringManagerName || 'Hiring Manager'},

I am writing to express my strong interest in the ${dto.positionTitle} position at ${dto.companyName}. With ${resumeAnalysis.experience?.years || 'several years'} of experience in ${resumeAnalysis.experience?.industries?.[0] || 'technology'}, I am confident that my skills and background make me an ideal candidate for this role.

In my previous roles, I have developed expertise in ${resumeAnalysis.skills?.slice(0, 3)?.join(', ') || 'various technologies'} and have successfully ${resumeAnalysis.achievements?.[0] || 'delivered high-quality solutions'}. My experience includes working with cross-functional teams and maintaining high standards of code quality and performance.

I am particularly drawn to ${dto.companyName} because of your reputation for innovation and excellence. The ${dto.positionTitle} role aligns perfectly with my career goals and technical expertise, and I am excited about the opportunity to contribute to your team's continued success.

I would welcome the opportunity to discuss how my experience and enthusiasm can benefit your organization. Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
${resumeAnalysis.personalInfo?.name || '[Your Name]'}`;
  }

  // Additional utility methods for cover letter templates
  async generateMultipleCoverLetters(
    dto: GenerateCoverLetterDto,
    variations: { tone: CoverLetterTone; length: CoverLetterLength }[]
  ): Promise<CoverLetterResponse[]> {
    const results = [];

    for (const variation of variations) {
      try {
        const modifiedDto = { ...dto, ...variation };
        const coverLetter = await this.generateCoverLetter(modifiedDto);
        results.push(coverLetter);
      } catch (error) {
        this.logger.error(`Failed to generate cover letter variation:`, error);
      }
    }

    return results;
  }

  async optimizeCoverLetterForATS(content: string, jobDescription: string): Promise<string> {
    const keywords = this.extractJobKeywords(jobDescription);
    let optimizedContent = content;

    // Suggest keyword integration points
    // This is a simplified version - could be enhanced with more sophisticated NLP
    
    return optimizedContent;
  }

  async getCoverLetterFeedback(content: string): Promise<any> {
    // Analyze cover letter and provide feedback
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).length;
    const avgWordsPerSentence = Math.round(wordCount / sentences);

    return {
      wordCount,
      sentences,
      avgWordsPerSentence,
      readabilityScore: this.calculateReadabilityScore(content),
      suggestions: this.generateDetailedFeedback(content)
    };
  }

  private calculateReadabilityScore(content: string): number {
    // Simplified Flesch Reading Ease score
    const sentences = content.split(/[.!?]+/).length;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);

    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private countSyllables(text: string): number {
    return text.toLowerCase()
      .split(/\s+/)
      .reduce((count, word) => {
        // Simple syllable counting (can be enhanced)
        const vowels = word.match(/[aeiouy]+/g);
        return count + (vowels ? vowels.length : 1);
      }, 0);
  }

  private generateDetailedFeedback(content: string): string[] {
    const feedback = [];
    
    const wordCount = content.split(/\s+/).length;
    
    if (wordCount < 250) {
      feedback.push('Consider expanding your cover letter with more specific examples');
    } else if (wordCount > 500) {
      feedback.push('Consider making your cover letter more concise for better impact');
    }

    if (!/(increased|improved|achieved|managed|led|developed)/i.test(content)) {
      feedback.push('Include more action verbs to strengthen your accomplishments');
    }

    if (!/(passion|excited|enthusiastic|interested)/i.test(content)) {
      feedback.push('Consider adding more expressions of enthusiasm for the role');
    }

    return feedback;
  }
}