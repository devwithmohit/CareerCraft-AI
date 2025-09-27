import { apiClient } from './api-client';
import { Resume, ResumeSection, ResumeAnalysis } from '../store/resume-store';

// Types for API requests and responses
export interface CreateResumeRequest {
  title: string;
  template: string;
  sections?: Partial<ResumeSection>[];
}

export interface UpdateResumeRequest {
  id: string;
  title?: string;
  template?: string;
  sections?: ResumeSection[];
}

export interface ExportResumeRequest {
  resumeData: any;
  template: string;
  format: 'pdf' | 'docx' | 'html' | 'png';
  filename?: string;
  options?: {
    quality?: 'low' | 'medium' | 'high';
    includeAnalysis?: boolean;
  };
}

export interface AnalyzeResumeRequest {
  resumeText?: string;
  resumeId?: string;
  jobDescription?: string;
  analysisType?: 'comprehensive' | 'ats_score' | 'keywords' | 'structure' | 'improvements';
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

// Resume CRUD Operations
export const resumeApi = {
  // Get all resumes for the current user
  async getResumes(): Promise<Resume[]> {
    try {
      const response = await apiClient.get('/resumes');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      throw new Error('Failed to fetch resumes');
    }
  },

  // Get a specific resume by ID
  async getResume(id: string): Promise<Resume> {
    try {
      const response = await apiClient.get(`/resumes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch resume ${id}:`, error);
      throw new Error('Failed to fetch resume');
    }
  },

  // Create a new resume
  async createResume(data: CreateResumeRequest): Promise<Resume> {
    try {
      const response = await apiClient.post('/resumes', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create resume:', error);
      throw new Error('Failed to create resume');
    }
  },

  // Update an existing resume
  async updateResume(data: UpdateResumeRequest): Promise<Resume> {
    try {
      const response = await apiClient.put(`/resumes/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Failed to update resume ${data.id}:`, error);
      throw new Error('Failed to update resume');
    }
  },

  // Delete a resume
  async deleteResume(id: string): Promise<void> {
    try {
      await apiClient.delete(`/resumes/${id}`);
    } catch (error) {
      console.error(`Failed to delete resume ${id}:`, error);
      throw new Error('Failed to delete resume');
    }
  },

  // Duplicate a resume
  async duplicateResume(id: string): Promise<Resume> {
    try {
      const response = await apiClient.post(`/resumes/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error(`Failed to duplicate resume ${id}:`, error);
      throw new Error('Failed to duplicate resume');
    }
  },

  // Update a specific section of a resume
  async updateSection(resumeId: string, sectionId: string, content: any): Promise<ResumeSection> {
    try {
      const response = await apiClient.put(`/resumes/${resumeId}/sections/${sectionId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to update section ${sectionId}:`, error);
      throw new Error('Failed to update section');
    }
  },

  // Add a new section to a resume
  async addSection(resumeId: string, section: Omit<ResumeSection, 'id'>): Promise<ResumeSection> {
    try {
      const response = await apiClient.post(`/resumes/${resumeId}/sections`, section);
      return response.data;
    } catch (error) {
      console.error('Failed to add section:', error);
      throw new Error('Failed to add section');
    }
  },

  // Remove a section from a resume
  async removeSection(resumeId: string, sectionId: string): Promise<void> {
    try {
      await apiClient.delete(`/resumes/${resumeId}/sections/${sectionId}`);
    } catch (error) {
      console.error(`Failed to remove section ${sectionId}:`, error);
      throw new Error('Failed to remove section');
    }
  },

  // Reorder sections in a resume
  async reorderSections(resumeId: string, sectionIds: string[]): Promise<ResumeSection[]> {
    try {
      const response = await apiClient.put(`/resumes/${resumeId}/sections/reorder`, {
        sectionIds,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to reorder sections:', error);
      throw new Error('Failed to reorder sections');
    }
  },

  // Export resume in various formats
  async exportResume(request: ExportResumeRequest): Promise<Blob> {
    try {
      const response = await apiClient.post('/resumes/export', request, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to export resume:', error);
      throw new Error('Failed to export resume');
    }
  },

  // Upload and parse resume file
  async uploadResume(file: File): Promise<{ resumeData: any; extractedText: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to upload resume:', error);
      throw new Error('Failed to upload resume');
    }
  },

  // Preview resume with template
  async previewResume(resumeData: any, templateId: string): Promise<{ html: string }> {
    try {
      const response = await apiClient.post('/resumes/preview', {
        resumeData,
        template: templateId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to preview resume:', error);
      throw new Error('Failed to preview resume');
    }
  },

  // Get available templates
  async getTemplates(): Promise<Array<{ id: string; name: string; description: string; preview: string }>> {
    try {
      const response = await apiClient.get('/resumes/templates');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw new Error('Failed to fetch templates');
    }
  },

  // Analyze resume
  async analyzeResume(request: AnalyzeResumeRequest): Promise<ResumeAnalysis> {
    try {
      const response = await apiClient.post('/ai/analyze-resume', request);
      return response.data.data; // API returns { success, data, timestamp }
    } catch (error) {
      console.error('Failed to analyze resume:', error);
      throw new Error('Failed to analyze resume');
    }
  },

  // Analyze resume from file
  async analyzeResumeFile(file: File, jobDescription?: string): Promise<ResumeAnalysis> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }

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

  // Generate content for specific sections
  async generateContent(request: GenerateContentRequest): Promise<{
    content: string;
    alternatives?: string[];
    suggestions?: string[];
    keywords?: string[];
  }> {
    try {
      const response = await apiClient.post('/ai/generate-content', request);
      return response.data.data;
    } catch (error) {
      console.error('Failed to generate content:', error);
      throw new Error('Failed to generate content');
    }
  },

  // Improve existing section
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

  // Get AI suggestions for resume improvement
  async getSuggestions(resumeId?: string, targetRole?: string): Promise<Array<{
    type: string;
    priority: string;
    message: string;
    section: string;
  }>> {
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

  // Optimize keywords for ATS
  async optimizeKeywords(resumeText: string, jobDescription: string): Promise<{
    currentKeywords: any;
    suggestions: string;
  }> {
    try {
      const response = await apiClient.post('/ai/optimize-keywords', {
        resumeText,
        jobDescription,
      });
      return response.data.data;
    } catch (error) {
      console.error('Failed to optimize keywords:', error);
      throw new Error('Failed to optimize keywords');
    }
  },

  // Get resume statistics
  async getStats(resumeId?: string): Promise<{
    totalViews: number;
    atsScore: number;
    completeness: number;
    lastAnalyzed: string;
    improvements: number;
  }> {
    try {
      const params = resumeId ? `?resumeId=${resumeId}` : '';
      const response = await apiClient.get(`/resumes/stats${params}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get resume stats:', error);
      throw new Error('Failed to get resume stats');
    }
  },

  // Batch operations
  async batchUpdate(updates: Array<{ resumeId: string; updates: Partial<Resume> }>): Promise<Resume[]> {
    try {
      const response = await apiClient.post('/resumes/batch-update', { updates });
      return response.data;
    } catch (error) {
      console.error('Failed to batch update resumes:', error);
      throw new Error('Failed to batch update resumes');
    }
  },

  // Share resume
  async shareResume(resumeId: string, options: {
    expiresIn?: number; // days
    password?: string;
    allowDownload?: boolean;
  }): Promise<{ shareUrl: string; shareId: string }> {
    try {
      const response = await apiClient.post(`/resumes/${resumeId}/share`, options);
      return response.data;
    } catch (error) {
      console.error('Failed to share resume:', error);
      throw new Error('Failed to share resume');
    }
  },

  // Get shared resume (public endpoint)
  async getSharedResume(shareId: string, password?: string): Promise<Resume> {
    try {
      const response = await apiClient.get(`/resumes/shared/${shareId}`, {
        headers: password ? { 'X-Share-Password': password } : {},
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get shared resume:', error);
      throw new Error('Failed to get shared resume');
    }
  },

  // Resume versioning
  async getResumeVersions(resumeId: string): Promise<Array<{
    id: string;
    version: number;
    createdAt: string;
    changes: string[];
  }>> {
    try {
      const response = await apiClient.get(`/resumes/${resumeId}/versions`);
      return response.data;
    } catch (error) {
      console.error('Failed to get resume versions:', error);
      throw new Error('Failed to get resume versions');
    }
  },

  // Restore resume version
  async restoreVersion(resumeId: string, versionId: string): Promise<Resume> {
    try {
      const response = await apiClient.post(`/resumes/${resumeId}/versions/${versionId}/restore`);
      return response.data;
    } catch (error) {
      console.error('Failed to restore resume version:', error);
      throw new Error('Failed to restore resume version');
    }
  },

  // Compare resume versions
  async compareVersions(resumeId: string, version1: string, version2: string): Promise<{
    differences: Array<{
      section: string;
      type: 'added' | 'removed' | 'modified';
      before?: any;
      after?: any;
    }>;
  }> {
    try {
      const response = await apiClient.get(
        `/resumes/${resumeId}/versions/compare?v1=${version1}&v2=${version2}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to compare resume versions:', error);
      throw new Error('Failed to compare resume versions');
    }
  },

  // Get resume templates with filtering
  async getTemplatesFiltered(filters: {
    category?: string;
    industry?: string;
    level?: string;
    atsOptimized?: boolean;
  }): Promise<Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    industry: string[];
    level: string[];
    atsScore: number;
    preview: string;
    features: string[];
  }>> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/resumes/templates/filtered?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch filtered templates:', error);
      throw new Error('Failed to fetch filtered templates');
    }
  },

  // Save resume as template
  async saveAsTemplate(resumeId: string, templateData: {
    name: string;
    description: string;
    category: string;
    isPublic?: boolean;
  }): Promise<{ templateId: string }> {
    try {
      const response = await apiClient.post(`/resumes/${resumeId}/save-as-template`, templateData);
      return response.data;
    } catch (error) {
      console.error('Failed to save resume as template:', error);
      throw new Error('Failed to save resume as template');
    }
  },

  // Get user's custom templates
  async getCustomTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    createdAt: string;
    usageCount: number;
  }>> {
    try {
      const response = await apiClient.get('/resumes/templates/custom');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch custom templates:', error);
      throw new Error('Failed to fetch custom templates');
    }
  },

  // Validate resume data
  async validateResume(resumeData: any): Promise<{
    isValid: boolean;
    errors: Array<{
      field: string;
      message: string;
      severity: 'error' | 'warning';
    }>;
    score: number;
  }> {
    try {
      const response = await apiClient.post('/resumes/validate', { resumeData });
      return response.data;
    } catch (error) {
      console.error('Failed to validate resume:', error);
      throw new Error('Failed to validate resume');
    }
  },

  // Get resume insights and analytics
  async getInsights(resumeId?: string, timeRange?: '7d' | '30d' | '90d'): Promise<{
    views: number;
    downloads: number;
    shares: number;
    atsScoreHistory: Array<{ date: string; score: number }>;
    topKeywords: string[];
    improvementTrends: Array<{ category: string; progress: number }>;
  }> {
    try {
      const params = new URLSearchParams();
      if (resumeId) params.append('resumeId', resumeId);
      if (timeRange) params.append('timeRange', timeRange);

      const response = await apiClient.get(`/resumes/insights?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get resume insights:', error);
      throw new Error('Failed to get resume insights');
    }
  },
};

// Helper functions for common operations
export const resumeHelpers = {
  // Create a resume from template
  async createFromTemplate(templateId: string, title: string): Promise<Resume> {
    const template = await resumeApi.getTemplates().then(templates => 
      templates.find(t => t.id === templateId)
    );
    
    if (!template) {
      throw new Error('Template not found');
    }

    return resumeApi.createResume({
      title,
      template: templateId,
    });
  },

  // Quick export to PDF
  async exportToPdf(resumeData: any, filename?: string): Promise<Blob> {
    return resumeApi.exportResume({
      resumeData,
      template: resumeData.template || 'ats-optimized',
      format: 'pdf',
      filename,
      options: { quality: 'high' },
    });
  },

  // Quick ATS analysis
  async quickAnalysis(resumeText: string, jobDescription?: string): Promise<{
    score: number;
    topIssues: string[];
  }> {
    const analysis = await resumeApi.analyzeResume({
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
  },

  // Format resume data for API
  formatResumeData(resume: Resume): any {
    return {
      id: resume.id,
      title: resume.title,
      template: resume.template,
      sections: resume.sections.map(section => ({
        id: section.id,
        type: section.type,
        title: section.title,
        content: section.content,
        order: section.order,
        isVisible: section.isVisible,
      })),
      atsScore: resume.atsScore,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    };
  },

  // Extract text content from resume for analysis
  extractTextContent(resume: Resume): string {
    const textParts: string[] = [];

    resume.sections.forEach(section => {
      if (!section.isVisible) return;

      switch (section.type) {
        case 'personal':
          const personal = section.content;
          textParts.push(
            `${personal.firstName} ${personal.lastName}`,
            personal.email,
            personal.phone,
            personal.location,
            personal.title || ''
          );
          break;

        case 'summary':
          textParts.push(section.content.text || '');
          break;

        case 'experience':
          section.content.jobs?.forEach((job: any) => {
            textParts.push(
              job.position,
              job.company,
              job.description || ''
            );
          });
          break;

        case 'education':
          section.content.degrees?.forEach((degree: any) => {
            textParts.push(
              degree.degree,
              degree.institution,
              degree.field || ''
            );
          });
          break;

        case 'skills':
          textParts.push(
            ...(section.content.technical || []),
            ...(section.content.soft || [])
          );
          break;

        default:
          if (typeof section.content === 'string') {
            textParts.push(section.content);
          } else if (section.content.text) {
            textParts.push(section.content.text);
          }
      }
    });

    return textParts.filter(Boolean).join(' ');
  },
};

export default resumeApi;