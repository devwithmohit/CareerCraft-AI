// @ts-nocheck
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ContentGenerationOptions {
  tone?: 'professional' | 'enthusiastic' | 'confident' | 'conversational';
  length?: 'short' | 'medium' | 'long';
  level?: 'entry' | 'mid' | 'senior' | 'executive';
  industry?: string;
  targetRole?: string;
  keywords?: string[];
}

export interface GeneratedContent {
  content: string;
  alternatives: string[];
  suggestions: string[];
  keywords: string[];
  wordCount: number;
}

@Injectable()
export class ContentGeneratorService {
  private readonly logger = new Logger(ContentGeneratorService.name);
  private genAI: GoogleGenerativeAI;

  // Content templates for different sections
  private readonly sectionTemplates = {
    summary: {
      entry: 'Recent graduate with [X] in [field]. Passionate about [industry] with hands-on experience in [skills]. Eager to contribute to [type of work] and grow within [industry] sector.',
      mid: 'Experienced [role] with [X] years in [industry]. Proven track record of [achievements]. Skilled in [skills] with expertise in [specialization]. Seeking to leverage experience in [target role].',
      senior: 'Senior [role] with [X]+ years of leadership experience in [industry]. Successfully [major achievement]. Expert in [skills] with a history of [impact]. Looking to drive [goals] as [target role].',
      executive: 'Strategic [role] with [X]+ years of executive experience. Led [scale] teams and managed [budget/scope]. Proven ability to [achievements]. Seeking C-level opportunities to [vision].'
    },
    experience: {
      bulletPoints: [
        'Led [team size] team to achieve [specific outcome] resulting in [quantified impact]',
        'Implemented [technology/process] that improved [metric] by [percentage]',
        'Managed [scope/budget] project from inception to completion, delivering [result]',
        'Collaborated with [stakeholders] to develop [solution] addressing [challenge]',
        'Optimized [process/system] reducing [metric] by [amount] and saving [cost/time]'
      ],
      achievements: [
        'Increased [metric] by [percentage] through [method/strategy]',
        'Reduced [cost/time/errors] by [amount] via [implementation]',
        'Successfully launched [product/initiative] resulting in [outcome]',
        'Mentored [number] team members, improving [performance metric] by [percentage]',
        'Streamlined [process] cutting [resource] requirements by [amount]'
      ]
    },
    skills: {
      technical: [
        'Programming Languages', 'Frameworks & Libraries', 'Databases', 'Cloud Platforms',
        'Development Tools', 'DevOps & CI/CD', 'Testing Frameworks', 'Version Control'
      ],
      soft: [
        'Leadership & Team Management', 'Project Management', 'Strategic Planning',
        'Communication & Presentation', 'Problem Solving', 'Critical Thinking',
        'Adaptability & Learning', 'Cross-functional Collaboration'
      ]
    }
  };

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('ai.geminiApiKey');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateContent(
    prompt: string, 
    section: string, 
    options: ContentGenerationOptions = {}
  ): Promise<GeneratedContent> {
    try {
      this.logger.log(`Generating content for section: ${section}`);

      // Generate content using AI
      const content = await this.generateWithAI(prompt, section, options);
      
      // Generate alternatives
      const alternatives = await this.generateAlternatives(content, section, options);
      
      // Extract keywords and suggestions
      const keywords = this.extractKeywords(content);
      const suggestions = this.generateSuggestions(content, section);
      
      const result: GeneratedContent = {
        content,
        alternatives,
        suggestions,
        keywords,
        wordCount: content.split(/\s+/).length,
      };

      this.logger.log(`Content generated successfully for section: ${section}`);
      return result;

    } catch (error) {
      this.logger.error(`Content generation failed for section ${section}:`, error);
      // Return fallback content
      return this.generateFallbackContent(section, options);
    }
  }

  private async generateWithAI(
    prompt: string, 
    section: string, 
    options: ContentGenerationOptions
  ): Promise<string> {
    if (!this.genAI) {
      return this.generateTemplateContent(section, options);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const enhancedPrompt = this.buildEnhancedPrompt(prompt, section, options);

      const result = await model.generateContent(enhancedPrompt);
      const response = result.response.text();

      return this.cleanAndFormatContent(response, section);

    } catch (error) {
      this.logger.error('AI content generation failed:', error);
      return this.generateTemplateContent(section, options);
    }
  }

  private buildEnhancedPrompt(
    prompt: string, 
    section: string, 
    options: ContentGenerationOptions
  ): string {
    const { tone = 'professional', length = 'medium', level = 'mid', industry, targetRole, keywords } = options;

    let enhancedPrompt = `
Generate professional resume content for the ${section} section.

REQUIREMENTS:
- Tone: ${tone}
- Length: ${length}
- Experience Level: ${level}
${industry ? `- Industry: ${industry}` : ''}
${targetRole ? `- Target Role: ${targetRole}` : ''}
${keywords ? `- Keywords to include: ${keywords.join(', ')}` : ''}

USER REQUEST: ${prompt}

SECTION-SPECIFIC GUIDELINES:
`;

    switch (section.toLowerCase()) {
      case 'summary':
      case 'objective':
        enhancedPrompt += `
- Create a compelling 3-4 sentence professional summary
- Include years of experience and key skills
- Highlight 1-2 major achievements or strengths
- End with career objective or value proposition
- Use action words and quantifiable results where possible
- Keep it concise but impactful
`;
        break;

      case 'experience':
      case 'work':
        enhancedPrompt += `
- Format as bullet points (3-5 per role)
- Start each bullet with strong action verbs
- Include quantifiable achievements (numbers, percentages, dollar amounts)
- Focus on impact and results, not just responsibilities
- Use past tense for previous roles, present tense for current role
- Prioritize most relevant and impressive accomplishments
`;
        break;

      case 'skills':
      case 'technical':
        enhancedPrompt += `
- Organize skills into relevant categories
- List most relevant and advanced skills first
- Include both technical and soft skills
- Use current industry terminology
- Group similar skills together
- Avoid outdated technologies unless specifically relevant
`;
        break;

      case 'education':
        enhancedPrompt += `
- Include degree, institution, graduation date
- Add GPA if 3.5 or higher
- Include relevant coursework, honors, or projects
- List certifications and professional development
- Format consistently and clearly
`;
        break;

      case 'projects':
        enhancedPrompt += `
- Include 2-4 most relevant projects
- Describe the challenge, your role, and the outcome
- Highlight technologies used and skills demonstrated
- Include links to live projects or repositories if applicable
- Show progression of complexity and responsibility
`;
        break;

      default:
        enhancedPrompt += `
- Create content appropriate for the ${section} section
- Use professional language and clear formatting
- Focus on relevant, quantifiable achievements
- Maintain consistency with overall resume tone
`;
    }

    enhancedPrompt += `

FORMATTING RULES:
- Use proper grammar and spelling
- Avoid personal pronouns (I, me, my)
- Use consistent tense throughout
- Keep bullet points concise (1-2 lines max)
- Use parallel structure in lists
- Ensure ATS-friendly formatting (no special characters)

Generate the content now:`;

    return enhancedPrompt;
  }

  private async generateAlternatives(
    originalContent: string, 
    section: string, 
    options: ContentGenerationOptions
  ): Promise<string[]> {
    if (!this.genAI) {
      return this.generateTemplateAlternatives(section, options);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const prompt = `
Create 2-3 alternative versions of this ${section} content:

Original: ${originalContent}

Requirements:
- Maintain the same core information
- Vary the tone and wording
- Keep the same professional quality
- Each version should be distinct but equally effective

Return alternatives separated by "---ALTERNATIVE---"
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return response.split('---ALTERNATIVE---')
        .map(alt => alt.trim())
        .filter(alt => alt.length > 0)
        .slice(0, 3);

    } catch (error) {
      this.logger.error('Alternative generation failed:', error);
      return this.generateTemplateAlternatives(section, options);
    }
  }

  private generateTemplateContent(section: string, options: ContentGenerationOptions): string {
    const { level = 'mid', industry = 'technology', targetRole = 'software engineer' } = options;

    switch (section.toLowerCase()) {
      case 'summary':
      case 'objective':
        const summaryTemplate = this.sectionTemplates.summary[level];
        return summaryTemplate
          .replace(/\[field\]/g, 'Computer Science')
          .replace(/\[industry\]/g, industry)
          .replace(/\[skills\]/g, 'programming and problem-solving')
          .replace(/\[role\]/g, targetRole)
          .replace(/\[X\]/g, '3-5')
          .replace(/\[achievements\]/g, 'delivering high-quality solutions')
          .replace(/\[target role\]/g, targetRole);

      case 'experience':
      case 'work':
        return this.sectionTemplates.experience.bulletPoints
          .slice(0, 3)
          .map(template => 
            template
              .replace(/\[team size\]/g, '5-person')
              .replace(/\[specific outcome\]/g, 'project delivery')
              .replace(/\[quantified impact\]/g, '25% efficiency improvement')
              .replace(/\[technology\/process\]/g, 'automated testing framework')
              .replace(/\[metric\]/g, 'code quality')
              .replace(/\[percentage\]/g, '30%')
          )
          .map(bullet => `• ${bullet}`)
          .join('\n');

      case 'skills':
      case 'technical':
        return [
          'Technical Skills: JavaScript, Python, React, Node.js, SQL, Git',
          'Frameworks: Express.js, Django, Next.js, Vue.js',
          'Databases: PostgreSQL, MongoDB, Redis',
          'Tools: Docker, AWS, Jenkins, JIRA'
        ].join('\n');

      default:
        return `Professional content for ${section} section with relevant experience and achievements.`;
    }
  }

  private generateTemplateAlternatives(section: string, options: ContentGenerationOptions): string[] {
    const original = this.generateTemplateContent(section, options);
    
    // Generate simple variations by rewording
    const alternatives = [];
    
    if (section.toLowerCase() === 'summary') {
      alternatives.push(
        'Results-driven professional with proven expertise in software development and team leadership. Strong background in full-stack development with focus on scalable solutions.',
        'Dedicated software engineer with comprehensive experience in modern web technologies. Passionate about creating efficient, user-centered applications that drive business success.'
      );
    } else if (section.toLowerCase() === 'experience') {
      alternatives.push(
        '• Developed and maintained web applications serving 10,000+ users\n• Collaborated with cross-functional teams to deliver features on schedule\n• Optimized database queries improving response time by 40%',
        '• Built responsive web interfaces using React and TypeScript\n• Implemented CI/CD pipelines reducing deployment time by 50%\n• Mentored junior developers on coding best practices'
      );
    } else {
      alternatives.push(original, original); // Fallback
    }

    return alternatives;
  }

  private cleanAndFormatContent(content: string, section: string): string {
    // Remove markdown formatting
    let cleaned = content.replace(/```[\w]*\n?/g, '').replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Format bullet points consistently
    if (section.toLowerCase() === 'experience' || section.toLowerCase() === 'skills') {
      cleaned = cleaned.replace(/^[-*]\s*/gm, '• ');
    }

    // Remove extra whitespace
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

    return cleaned;
  }

  private extractKeywords(content: string): string[] {
    // Extract relevant keywords from the generated content
    const text = content.toLowerCase();
    const words = text.match(/\b\w{3,}\b/g) || [];
    
    // Filter for relevant professional keywords
    const relevantKeywords = words.filter(word => {
      return word.length > 3 && 
             !['that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'been', 'more', 'than', 'also', 'were', 'said'].includes(word);
    });

    // Return unique keywords, limited to top 10
    return [...new Set(relevantKeywords)].slice(0, 10);
  }

  private generateSuggestions(content: string, section: string): string[] {
    const suggestions = [];
    const wordCount = content.split(/\s+/).length;

    // General suggestions based on content analysis
    if (!/\d+/.test(content)) {
      suggestions.push('Consider adding quantifiable achievements with numbers or percentages');
    }

    if (section.toLowerCase() === 'experience' && !/increased|improved|reduced|achieved|led|managed/.test(content.toLowerCase())) {
      suggestions.push('Use more action verbs to make your accomplishments more impactful');
    }

    if (section.toLowerCase() === 'summary' && wordCount > 80) {
      suggestions.push('Consider shortening your summary to 50-70 words for better impact');
    }

    if (section.toLowerCase() === 'skills' && !content.includes(',')) {
      suggestions.push('Consider organizing skills into categories for better readability');
    }

    if (suggestions.length === 0) {
      suggestions.push('Content looks good! Consider tailoring it to specific job requirements.');
    }

    return suggestions;
  }

  private generateFallbackContent(section: string, options: ContentGenerationOptions): GeneratedContent {
    const content = this.generateTemplateContent(section, options);
    const alternatives = this.generateTemplateAlternatives(section, options);

    return {
      content,
      alternatives,
      suggestions: ['Generated using template. Consider customizing for your specific experience.'],
      keywords: this.extractKeywords(content),
      wordCount: content.split(/\s+/).length,
    };
  }

  // Specialized content generation methods
  async generateProfessionalSummary(
    yearsExperience: number,
    skills: string[],
    achievements: string[],
    targetRole: string,
    options: ContentGenerationOptions = {}
  ): Promise<GeneratedContent> {
    const prompt = `
Create a professional summary for someone with ${yearsExperience} years of experience.
Key skills: ${skills.join(', ')}
Major achievements: ${achievements.join(', ')}
Target role: ${targetRole}
`;

    return this.generateContent(prompt, 'summary', options);
  }

  async generateJobBulletPoints(
    jobTitle: string,
    company: string,
    responsibilities: string[],
    achievements: string[],
    options: ContentGenerationOptions = {}
  ): Promise<GeneratedContent> {
    const prompt = `
Create bullet points for a ${jobTitle} role at ${company}.
Responsibilities: ${responsibilities.join(', ')}
Achievements: ${achievements.join(', ')}
Focus on quantifiable results and impact.
`;

    return this.generateContent(prompt, 'experience', options);
  }

  async generateSkillsSection(
    technicalSkills: string[],
    softSkills: string[],
    certifications: string[],
    options: ContentGenerationOptions = {}
  ): Promise<GeneratedContent> {
    const prompt = `
Organize these skills into a professional skills section:
Technical: ${technicalSkills.join(', ')}
Soft Skills: ${softSkills.join(', ')}
Certifications: ${certifications.join(', ')}
`;

    return this.generateContent(prompt, 'skills', options);
  }

  async improveExistingContent(
    existingContent: string,
    section: string,
    improvements: string[] = []
  ): Promise<GeneratedContent> {
    const prompt = `
Improve this ${section} content:
${existingContent}

Focus on: ${improvements.length > 0 ? improvements.join(', ') : 'clarity, impact, and professional tone'}
`;

    return this.generateContent(prompt, section);
  }

  async generateImprovements(resumeText: string, targetRole?: string) {
    try {
      this.logger.log('Generating improvement suggestions...');

      if (!this.genAI) {
        return this.getFallbackImprovements();
      }

      const model = this.genAI.getGenerativeModel({ 
        model: this.configService.get('ai.geminiModel') 
      });

      const prompt = `
Analyze this resume and provide specific, actionable improvement suggestions.
${targetRole ? `Target Role: ${targetRole}` : ''}

Resume: ${resumeText}

Provide 5-8 specific improvements in JSON format:
{
  "improvements": [
    {
      "category": "formatting|content|keywords|structure|achievements",
      "priority": "high|medium|low",
      "suggestion": "specific actionable improvement",
      "impact": "expected benefit",
      "section": "affected resume section"
    }
  ]
}

Focus on:
- Adding quantifiable achievements
- Improving keyword usage
- Enhancing action verbs
- Better formatting and structure
- Industry-specific improvements
`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      try {
        const parsed = JSON.parse(response.replace(/```json|```/g, ''));
        return parsed.improvements || this.getFallbackImprovements();
      } catch {
        return this.getFallbackImprovements();
      }

    } catch (error) {
      this.logger.error('Improvement generation failed:', error);
      return this.getFallbackImprovements();
    }
  }

  private getFallbackImprovements() {
    return [
      {
        category: 'achievements',
        priority: 'high',
        suggestion: 'Add quantifiable achievements with specific numbers, percentages, or dollar amounts',
        impact: 'Makes your accomplishments more concrete and impressive',
        section: 'experience'
      },
      {
        category: 'content',
        priority: 'high',
        suggestion: 'Use stronger action verbs like "led," "implemented," "optimized," and "achieved"',
        impact: 'Creates more dynamic and impactful descriptions',
        section: 'experience'
      },
      {
        category: 'keywords',
        priority: 'medium',
        suggestion: 'Include industry-specific keywords from job descriptions you\'re targeting',
        impact: 'Improves ATS compatibility and relevance to specific roles',
        section: 'all'
      },
      {
        category: 'structure',
        priority: 'medium',
        suggestion: 'Ensure consistent formatting with proper bullet points and spacing',
        impact: 'Enhances readability and professional appearance',
        section: 'formatting'
      },
      {
        category: 'content',
        priority: 'low',
        suggestion: 'Consider adding a skills section if not present, or reorganizing existing skills',
        impact: 'Helps highlight your technical competencies',
        section: 'skills'
      }
    ];
  }

  // Utility method to get content generation statistics
  async getContentStats() {
    return {
      supportedSections: ['summary', 'experience', 'skills', 'education', 'projects'],
      availableTones: ['professional', 'enthusiastic', 'confident', 'conversational'],
      lengthOptions: ['short', 'medium', 'long'],
      experienceLevels: ['entry', 'mid', 'senior', 'executive'],
      templateCategories: Object.keys(this.sectionTemplates),
    };
  }
}