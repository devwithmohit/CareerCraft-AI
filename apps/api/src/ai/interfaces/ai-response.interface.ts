export interface AIResponse<T = any> {
  success: boolean;
  data: T;
  timestamp: string;
  processingTime?: number;
  model?: string;
  tokensUsed?: number;
}

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
  section: string;
  suggestions?: string[];
  alternatives?: string[];
}

export interface AIServiceStatus {
  service: string;
  status: 'active' | 'inactive' | 'error';
  model: string;
  lastUsed?: string;
  errorMessage?: string;
}

export interface AIUsageStats {
  totalRequests: number;
  requestsToday: number;
  averageProcessingTime: number;
  mostUsedFeature: string;
  successRate: number;
}