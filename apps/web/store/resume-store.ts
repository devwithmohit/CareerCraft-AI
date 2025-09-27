import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface ResumeSection {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';
  title: string;
  content: any;
  order: number;
  isVisible: boolean;
}

export interface Resume {
  id?: string;
  title: string;
  template: string;
  sections: ResumeSection[];
  atsScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  keywords: {
    matched: string[];
    missing: string[];
    total: number;
    matchPercentage: number;
  };
  improvements: Array<{
    category: string;
    priority: string;
    suggestion: string;
    impact: string;
  }>;
  structure: {
    completeness: number;
    recommendations: string[];
  };
}

interface ResumeStore {
  // State
  currentResume: Resume | null;
  resumes: Resume[];
  selectedTemplate: string;
  analysis: ResumeAnalysis | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  isExporting: boolean;
  
  // Actions
  setCurrentResume: (resume: Resume | null) => void;
  updateResumeSection: (sectionId: string, content: any) => void;
  addSection: (section: Omit<ResumeSection, 'id' | 'order'>) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sectionIds: string[]) => void;
  setSelectedTemplate: (template: string) => void;
  
  // Resume Management
  createNewResume: (title: string, template: string) => void;
  saveResume: () => Promise<void>;
  loadResume: (resumeId: string) => Promise<void>;
  duplicateResume: (resumeId: string) => void;
  deleteResume: (resumeId: string) => void;
  
  // AI Features
  analyzeResume: (jobDescription?: string) => Promise<void>;
  generateContent: (section: string, prompt: string) => Promise<string>;
  improveSection: (sectionId: string) => Promise<void>;
  
  // Export
  exportResume: (format: 'pdf' | 'docx' | 'html') => Promise<Blob>;
  
  // Reset
  reset: () => void;
}

const createDefaultResume = (title: string, template: string): Resume => ({
  title,
  template,
  sections: [
    {
      id: 'personal',
      type: 'personal',
      title: 'Personal Information',
      content: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
      },
      order: 0,
      isVisible: true,
    },
    {
      id: 'summary',
      type: 'summary',
      title: 'Professional Summary',
      content: {
        text: '',
      },
      order: 1,
      isVisible: true,
    },
    {
      id: 'experience',
      type: 'experience',
      title: 'Work Experience',
      content: {
        jobs: [],
      },
      order: 2,
      isVisible: true,
    },
    {
      id: 'education',
      type: 'education',
      title: 'Education',
      content: {
        degrees: [],
      },
      order: 3,
      isVisible: true,
    },
    {
      id: 'skills',
      type: 'skills',
      title: 'Skills',
      content: {
        technical: [],
        soft: [],
      },
      order: 4,
      isVisible: true,
    },
  ],
});

export const useResumeStore = create<ResumeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        currentResume: null,
        resumes: [],
        selectedTemplate: 'modern',
        analysis: null,
        isAnalyzing: false,
        isGenerating: false,
        isExporting: false,

        // Actions
        setCurrentResume: (resume) => set({ currentResume: resume }),

        updateResumeSection: (sectionId, content) => {
          const { currentResume } = get();
          if (!currentResume) return;

          const updatedSections = currentResume.sections.map(section =>
            section.id === sectionId ? { ...section, content } : section
          );

          set({
            currentResume: {
              ...currentResume,
              sections: updatedSections,
              updatedAt: new Date().toISOString(),
            }
          });
        },

        addSection: (sectionData) => {
          const { currentResume } = get();
          if (!currentResume) return;

          const newSection: ResumeSection = {
            ...sectionData,
            id: `${sectionData.type}-${Date.now()}`,
            order: currentResume.sections.length,
          };

          set({
            currentResume: {
              ...currentResume,
              sections: [...currentResume.sections, newSection],
            }
          });
        },

        removeSection: (sectionId) => {
          const { currentResume } = get();
          if (!currentResume) return;

          const updatedSections = currentResume.sections.filter(
            section => section.id !== sectionId
          );

          set({
            currentResume: {
              ...currentResume,
              sections: updatedSections,
            }
          });
        },

        reorderSections: (sectionIds) => {
          const { currentResume } = get();
          if (!currentResume) return;

          const reorderedSections = sectionIds.map((id, index) => {
            const section = currentResume.sections.find(s => s.id === id);
            return section ? { ...section, order: index } : null;
          }).filter(Boolean) as ResumeSection[];

          set({
            currentResume: {
              ...currentResume,
              sections: reorderedSections,
            }
          });
        },

        setSelectedTemplate: (template) => set({ selectedTemplate: template }),

        // Resume Management
        createNewResume: (title, template) => {
          const newResume = createDefaultResume(title, template);
          set({ 
            currentResume: newResume,
            selectedTemplate: template 
          });
        },

        saveResume: async () => {
          const { currentResume, resumes } = get();
          if (!currentResume) return;

          try {
            // API call to save resume
            const response = await fetch('/api/resumes', {
              method: currentResume.id ? 'PUT' : 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(currentResume),
            });

            if (response.ok) {
              const savedResume = await response.json();
              
              const updatedResumes = currentResume.id
                ? resumes.map(r => r.id === currentResume.id ? savedResume : r)
                : [...resumes, savedResume];

              set({
                currentResume: savedResume,
                resumes: updatedResumes,
              });
            }
          } catch (error) {
            console.error('Failed to save resume:', error);
            throw error;
          }
        },

        loadResume: async (resumeId) => {
          try {
            const response = await fetch(`/api/resumes/${resumeId}`);
            if (response.ok) {
              const resume = await response.json();
              set({ currentResume: resume });
            }
          } catch (error) {
            console.error('Failed to load resume:', error);
            throw error;
          }
        },

        duplicateResume: (resumeId) => {
          const { resumes } = get();
          const originalResume = resumes.find(r => r.id === resumeId);
          
          if (originalResume) {
            const duplicatedResume = {
              ...originalResume,
              id: undefined,
              title: `${originalResume.title} (Copy)`,
              createdAt: undefined,
              updatedAt: undefined,
            };
            
            set({ currentResume: duplicatedResume });
          }
        },

        deleteResume: async (resumeId) => {
          try {
            const response = await fetch(`/api/resumes/${resumeId}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              const { resumes } = get();
              set({
                resumes: resumes.filter(r => r.id !== resumeId),
              });
            }
          } catch (error) {
            console.error('Failed to delete resume:', error);
            throw error;
          }
        },

        // AI Features
        analyzeResume: async (jobDescription) => {
          const { currentResume } = get();
          if (!currentResume) return;

          set({ isAnalyzing: true });

          try {
            const response = await fetch('/api/ai/analyze-resume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resume: currentResume,
                jobDescription,
              }),
            });

            if (response.ok) {
              const analysis = await response.json();
              set({ analysis: analysis.data });
            }
          } catch (error) {
            console.error('Failed to analyze resume:', error);
            throw error;
          } finally {
            set({ isAnalyzing: false });
          }
        },

        generateContent: async (section, prompt) => {
          set({ isGenerating: true });

          try {
            const response = await fetch('/api/ai/generate-content', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ section, prompt }),
            });

            if (response.ok) {
              const result = await response.json();
              return result.data.content;
            }
            
            throw new Error('Failed to generate content');
          } catch (error) {
            console.error('Failed to generate content:', error);
            throw error;
          } finally {
            set({ isGenerating: false });
          }
        },

        improveSection: async (sectionId) => {
          const { currentResume } = get();
          if (!currentResume) return;

          const section = currentResume.sections.find(s => s.id === sectionId);
          if (!section) return;

          set({ isGenerating: true });

          try {
            const response = await fetch('/api/ai/improve-section', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                section: section.content,
                type: section.type,
              }),
            });

            if (response.ok) {
              const result = await response.json();
              get().updateResumeSection(sectionId, result.data.content);
            }
          } catch (error) {
            console.error('Failed to improve section:', error);
            throw error;
          } finally {
            set({ isGenerating: false });
          }
        },

        // Export
        exportResume: async (format) => {
          const { currentResume } = get();
          if (!currentResume) throw new Error('No resume to export');

          set({ isExporting: true });

          try {
            const response = await fetch('/api/resumes/export', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                resume: currentResume,
                format,
              }),
            });

            if (response.ok) {
              return await response.blob();
            }
            
            throw new Error('Failed to export resume');
          } catch (error) {
            console.error('Failed to export resume:', error);
            throw error;
          } finally {
            set({ isExporting: false });
          }
        },

        // Reset
        reset: () => set({
          currentResume: null,
          selectedTemplate: 'modern',
          analysis: null,
          isAnalyzing: false,
          isGenerating: false,
          isExporting: false,
        }),
      }),
      {
        name: 'resume-store',
        partialize: (state) => ({
          resumes: state.resumes,
          selectedTemplate: state.selectedTemplate,
        }),
      }
    ),
    { name: 'resume-store' }
  )
);