import { apiClient } from './api-client';

// Types for AI API requests and responses
export interface AnalyzeResumeRequest {
  resumeText?: string;
  resumeId?: string;
  jobDescription?: string;
  analysisType?: 'comprehensive' | 'ats_score' | 'keywords' | 'structure' | 'improvements';
  targetRole?: string;
  industry?: string;
  experienceLevel?: string;
}

export interface JobMatchRequest {
  resumeText: string;
  preferredTitles?: string[];
  preferredLocations?: string[];
  minSalary?: number;
  maxSalary?: number;
  experienceLevel?: string;
  requiredSkills?: string[];
  companySize?: string;
  remoteWork?: boolean;
  industries?: string[];
  matchThreshold?: number;
  limit?: number;
}

export interface GenerateCoverLetterRequest {
  resumeText: string;
  jobDescription: string;
  companyName: string;
  positionTitle: string;
  hiringManagerName?: string;
  tone?: 'professional' | 'enthusiastic' | 'confident' | 'conversational' | 'formal';
  length?: 'short' | 'medium' | 'long';
  keyPoints?: string[];
  companyResearch?: string;
  skillsToEmphasize?: string[];
  personalMotivation?: string;
}

export interface GenerateContentRequest {
  section: string;
  prompt: string;
  currentContent?: any;
  options?: {
    tone?: 'professional' | 'enthusiastic' | 'confident' | 'conversational';
    length?: 'short' | 'medium' | 'long';
    level?: 'entry' | 'mid' | 'senior' | 'executive';
    industry?: string;
    targetRole?: string;
    keywords?: string[];
  };
}

export interface ImproveSectionRequest {
  section: any;
  type: string;
  targetRole?: string;
  improvements?: string[];
}

export interface OptimizeKeywordsRequest {
  resumeText: string;
  jobDescription: string;
}

export interface BatchAnalyzeRequest {
  resumes: string[];
  jobDescription?: string;
}

// Response Types
export interface ResumeAnalysisResponse {
  atsScore: number;
  keywords: {
    matched: string[];
    missing: string[];
    total: number;
    matchPercentage: number;
  };
  structure: {
    sections: Record<string, boolean>;
    completeness: number;
    recommendations: string[];
  };
  skills: {
    technical: string[];
    soft: string[];
    total: number;
    recommendations: string[];
  };
  improvements: Array<{
    category: string;
    priority: string;
    suggestion: string;
    impact: string;
  }>;
  summary: string;
  analysisType: string;
  processedAt: string;
}

export interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  location: string;
  salaryRange?: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  description: string;
  url?: string;
  postedDate?: string;
  requirements: string[];
  benefits?: string[];
}

export interface CoverLetterResponse {
  content: string;
  tone: string;
  length: number;
  keyPoints: string[];
  personalizations: string[];
  suggestions: string[];
}

export interface ContentGenerationResponse {
  content: string;
  alternatives?: string[];
  suggestions?: string[];
  keywords?: string[];
  wordCount: number;
}

export interface AISuggestion {
  type: string;
  priority: string;
  message: string;
  section: string;
}

export interface AIStats {
  services: Record<string, string>;
  config: {
    maxTokens: number;
    temperature: number;
    models: Record<string, boolean>;
  };
  timestamp: string;
}

// AI API Client
export const aiApi = {
  // Resume Analysis
  async analyzeResume(request: AnalyzeResumeRequest): Promise<ResumeAnalysisResponse> {
    try {
      const response = await apiClient.post('/ai/analyze-resume', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      throw new Error('Failed to analyze resume');
    }
  },

  // Analyze resume from file upload
  async analyzeResumeFile(
    file: File, 
    jobDescription?: string, 
    analysisType?: string
  ): Promise<ResumeAnalysisResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (jobDescription) formData.append('jobDescription', jobDescription);
      if (analysisType) formData.append('analysisType', analysisType);

      const response = await apiClient.post('/ai/analyze-resume-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to analyze resume file:', error);
      throw new Error('Failed to analyze resume file');
    }
  },

  // Job Matching
  async matchJobs(request: JobMatchRequest): Promise<JobMatch[]> {
    try {
      const response = await apiClient.post('/ai/match-jobs', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to match jobs:', error);
      throw new Error('Failed to match jobs');
    }
  },

  // Cover Letter Generation
  async generateCoverLetter(request: GenerateCoverLetterRequest): Promise<CoverLetterResponse> {
    try {
      const response = await apiClient.post('/ai/generate-cover-letter', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to generate cover letter:', error);
      throw new Error('Failed to generate cover letter');
    }
  },

  // Content Generation
  async generateContent(request: GenerateContentRequest): Promise<ContentGenerationResponse> {
    try {
      const response = await apiClient.post('/ai/generate-content', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to generate content:', error);
      throw new Error('Failed to generate content');
    }
  },

  // Section Improvement
  async improveSection(request: ImproveSectionRequest): Promise<{
    content: any;
    improvements: string[];
    suggestions: string[];
  }> {
    try {
      const response = await apiClient.post('/ai/improve-section', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to improve section:', error);
      throw new Error('Failed to improve section');
    }
  },

  // Keyword Optimization
  async optimizeKeywords(request: OptimizeKeywordsRequest): Promise<{
    currentKeywords: any;
    suggestions: string;
  }> {
    try {
      const response = await apiClient.post('/ai/optimize-keywords', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to optimize keywords:', error);
      throw new Error('Failed to optimize keywords');
    }
  },

  // Get AI Suggestions
  async getSuggestions(
    resumeId?: string, 
    targetRole?: string
  ): Promise<AISuggestion[]> {
    try {
      const params = new URLSearchParams();
      if (resumeId) params.append('resumeId', resumeId);
      if (targetRole) params.append('targetRole', targetRole);

      const response = await apiClient.get(`/ai/suggestions?${params.toString()}`);
      return response.data.data.suggestions;
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      throw new Error('Failed to get AI suggestions');
    }
  },

  // Batch Analysis
  async batchAnalyze(request: BatchAnalyzeRequest): Promise<ResumeAnalysisResponse[]> {
    try {
      const response = await apiClient.post('/ai/batch-analyze', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to batch analyze:', error);
      throw new Error('Failed to batch analyze');
    }
  },

  // AI Service Statistics
  async getAiStats(): Promise<AIStats> {
    try {
      const response = await apiClient.get('/ai/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to get AI stats:', error);
      throw new Error('Failed to get AI stats');
    }
  },

  // Health Check
  async healthCheck(): Promise<{
    status: string;
    services: Record<string, string>;
    timestamp: string;
  }> {
    try {
      const response = await apiClient.get('/ai/health');
      return response.data;
    } catch (error) {
      console.error('Failed to check AI health:', error);
      throw new Error('Failed to check AI health');
    }
  },
};

// Specialized AI Functions
export const aiHelpers = {
  // Quick resume score
  async getQuickScore(resumeText: string, jobDescription?: string): Promise<{
    score: number;
    topIssues: string[];
  }> {
    try {
      const analysis = await aiApi.analyzeResume({
        resumeText,
        jobDescription,
        analysisType: 'ats_score',
      });

      return {
        score: analysis.atsScore,
        topIssues: analysis.improvements
          .filter(imp => imp.priority === 'high')
          .map(imp => imp.suggestion)
          .slice(0, 3),
      };
    } catch (error) {
      console.error('Failed to get quick score:', error);
      throw error;
    }
  },

  // Generate professional summary
  async generateProfessionalSummary(
    yearsExperience: number,
    skills: string[],
    targetRole: string,
    industry?: string
  ): Promise<ContentGenerationResponse> {
    const prompt = `
      Create a professional summary for someone with ${yearsExperience} years of experience.
      Key skills: ${skills.join(', ')}
      Target role: ${targetRole}
      ${industry ? `Industry: ${industry}` : ''}
    `;

    return aiApi.generateContent({
      section: 'summary',
      prompt,
      options: {
        tone: 'professional',
        length: 'medium',
        level: yearsExperience < 2 ? 'entry' : yearsExperience < 5 ? 'mid' : 'senior',
        industry,
        targetRole,
        keywords: skills,
      },
    });
  },

  // Generate job bullet points
  async generateJobBulletPoints(
    jobTitle: string,
    company: string,
    responsibilities: string[],
    achievements?: string[]
  ): Promise<ContentGenerationResponse> {
    const prompt = `
      Create bullet points for a ${jobTitle} role at ${company}.
      Responsibilities: ${responsibilities.join(', ')}
      ${achievements ? `Achievements: ${achievements.join(', ')}` : ''}
      Focus on quantifiable results and impact.
    `;

    return aiApi.generateContent({
      section: 'experience',
      prompt,
      options: {
        tone: 'professional',
        length: 'medium',
      },
    });
  },

  // Optimize for specific job
  async optimizeForJob(
    resumeText: string,
    jobDescription: string
  ): Promise<{
    analysis: ResumeAnalysisResponse;
    keywordSuggestions: any;
    coverLetter?: CoverLetterResponse;
  }> {
    try {
      const [analysis, keywordSuggestions] = await Promise.all([
        aiApi.analyzeResume({ resumeText, jobDescription, analysisType: 'comprehensive' }),
        aiApi.optimizeKeywords({ resumeText, jobDescription }),
      ]);

      return {
        analysis,
        keywordSuggestions,
      };
    } catch (error) {
      console.error('Failed to optimize for job:', error);
      throw error;
    }
  },

  // Get improvement roadmap
  async getImprovementRoadmap(
    resumeText: string,
    targetRole?: string
  ): Promise<{
    currentScore: number;
    improvements: Array<{
      category: string;
      priority: string;
      suggestion: string;
      impact: string;
      estimatedScoreIncrease: number;
    }>;
    projectedScore: number;
  }> {
    try {
      const analysis = await aiApi.analyzeResume({ 
        resumeText, 
        analysisType: 'improvements',
        targetRole 
      });

      // Estimate score increases for each improvement
      const improvementsWithScores = analysis.improvements.map(imp => ({
        ...imp,
        estimatedScoreIncrease: imp.priority === 'high' ? 10 : imp.priority === 'medium' ? 5 : 2,
      }));

      const totalPotentialIncrease = improvementsWithScores.reduce(
        (sum, imp) => sum + imp.estimatedScoreIncrease, 
        0
      );

      return {
        currentScore: analysis.atsScore,
        improvements: improvementsWithScores,
        projectedScore: Math.min(100, analysis.atsScore + totalPotentialIncrease),
      };
    } catch (error) {
      console.error('Failed to get improvement roadmap:', error);
      throw error;
    }
  },

  // Compare resume versions
  async compareResumeVersions(
    originalResume: string,
    improvedResume: string,
    jobDescription?: string
  ): Promise<{
    original: ResumeAnalysisResponse;
    improved: ResumeAnalysisResponse;
    improvements: {
      scoreIncrease: number;
      keywordImprovement: number;
      structureImprovement: number;
    };
  }> {
    try {
      const [originalAnalysis, improvedAnalysis] = await Promise.all([
        aiApi.analyzeResume({ resumeText: originalResume, jobDescription }),
        aiApi.analyzeResume({ resumeText: improvedResume, jobDescription }),
      ]);

      return {
        original: originalAnalysis,
        improved: improvedAnalysis,
        improvements: {
          scoreIncrease: improvedAnalysis.atsScore - originalAnalysis.atsScore,
          keywordImprovement: improvedAnalysis.keywords.matchPercentage - originalAnalysis.keywords.matchPercentage,
          structureImprovement: improvedAnalysis.structure.completeness - originalAnalysis.structure.completeness,
        },
      };
    } catch (error) {
      console.error('Failed to compare resume versions:', error);
      throw error;
    }
  },

  // Generate skills assessment
  async generateSkillsAssessment(
    currentSkills: string[],
    targetRole: string,
    industry?: string
  ): Promise<{
    strengths: string[];
    gaps: string[];
    recommendations: string[];
    learningPath: Array<{
      skill: string;
      priority: 'high' | 'medium' | 'low';
      estimatedLearningTime: string;
      resources: string[];
    }>;
  }> {
    try {
      const prompt = `
        Analyze these current skills for a ${targetRole} role${industry ? ` in ${industry}` : ''}:
        ${currentSkills.join(', ')}
        
        Provide a skills assessment with strengths, gaps, and learning recommendations.
      `;

      const content = await aiApi.generateContent({
        section: 'skills',
        prompt,
        options: {
          targetRole,
          industry,
          keywords: currentSkills,
        },
      });

      // This would typically return structured data from the AI
      // For now, return a simplified response
      return {
        strengths: currentSkills.slice(0, 5),
        gaps: ['Cloud Computing', 'DevOps', 'Machine Learning'],
        recommendations: [
          'Focus on cloud technologies for better job market positioning',
          'Develop DevOps skills to improve deployment capabilities',
          'Consider machine learning fundamentals for future-proofing',
        ],
        learningPath: [
          {
            skill: 'AWS Cloud Practitioner',
            priority: 'high',
            estimatedLearningTime: '2-3 months',
            resources: ['AWS Training', 'Online Courses', 'Practice Labs'],
          },
        ],
      };
    } catch (error) {
      console.error('Failed to generate skills assessment:', error);
      throw error;
    }
  },

  // Format resume text for analysis
  formatResumeForAnalysis(resumeData: any): string {
    const sections = [];

    // Personal Info
    if (resumeData.personalInfo) {
      const personal = resumeData.personalInfo;
      sections.push(
        `${personal.firstName} ${personal.lastName}`,
        personal.title || '',
        personal.email,
        personal.phone,
        personal.location
      );
    }

    // Summary
    if (resumeData.summary) {
      sections.push('PROFESSIONAL SUMMARY', resumeData.summary);
    }

    // Experience
    if (resumeData.experience?.length > 0) {
      sections.push('WORK EXPERIENCE');
      resumeData.experience.forEach((job: any) => {
        sections.push(
          `${job.position} at ${job.company}`,
          `${job.startDate} - ${job.current ? 'Present' : job.endDate}`,
          job.description || '',
          ...(job.achievements || [])
        );
      });
    }

    // Education
    if (resumeData.education?.length > 0) {
      sections.push('EDUCATION');
      resumeData.education.forEach((edu: any) => {
        sections.push(
          `${edu.degree} from ${edu.institution}`,
          `${edu.startDate} - ${edu.endDate}`
        );
      });
    }

    // Skills
    if (resumeData.skills) {
      sections.push('SKILLS');
      if (resumeData.skills.technical) {
        sections.push('Technical Skills:', resumeData.skills.technical.join(', '));
      }
      if (resumeData.skills.soft) {
        sections.push('Soft Skills:', resumeData.skills.soft.join(', '));
      }
    }

    return sections.filter(Boolean).join('\n');
  },

  // Extract job requirements from description
  extractJobRequirements(jobDescription: string): {
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: string;
    responsibilities: string[];
  } {
    const text = jobDescription.toLowerCase();
    
    // Simple extraction logic - can be enhanced with NLP
    const commonSkills = [
      'javascript', 'python', 'java', 'react', 'node.js', 'sql', 'aws',
      'docker', 'kubernetes', 'git', 'typescript', 'angular', 'vue'
    ];

    const requiredSkills = commonSkills.filter(skill => 
      text.includes(skill) && (
        text.includes(`${skill} required`) || 
        text.includes(`experience with ${skill}`)
      )
    );

    const preferredSkills = commonSkills.filter(skill => 
      text.includes(skill) && text.includes(`${skill} preferred`)
    );

    let experienceLevel = 'Mid-Level';
    if (text.includes('senior') || text.includes('lead')) {
      experienceLevel = 'Senior';
    } else if (text.includes('junior') || text.includes('entry')) {
      experienceLevel = 'Entry-Level';
    }

    return {
      requiredSkills,
      preferredSkills,
      experienceLevel,
      responsibilities: [], // Would be extracted with more sophisticated parsing
    };
  },
};

export default aiApi;