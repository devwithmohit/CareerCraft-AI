import { useState, useCallback, useEffect } from 'react';
import { useResumeStore } from '../store/resume-store';
import { usePdfExport } from './use-pdf-export';
import { useAiSuggestions } from './use-ai-suggestions';
import { toast } from 'sonner';

export interface BuilderState {
  activeSection: string | null;
  previewMode: 'desktop' | 'mobile' | 'print';
  showPreview: boolean;
  autoSave: boolean;
  isDirty: boolean;
}

export const useResumeBuilder = () => {
  const {
    currentResume,
    selectedTemplate,
    isAnalyzing,
    isGenerating,
    setCurrentResume,
    updateResumeSection,
    addSection,
    removeSection,
    reorderSections,
    setSelectedTemplate,
    saveResume,
    analyzeResume,
    generateContent,
    improveSection,
  } = useResumeStore();

  const { exportToPdf, isExporting } = usePdfExport();
  const { getSuggestions, applySuggestion } = useAiSuggestions();

  const [builderState, setBuilderState] = useState<BuilderState>({
    activeSection: null,
    previewMode: 'desktop',
    showPreview: true,
    autoSave: true,
    isDirty: false,
  });

  // Auto-save functionality
  useEffect(() => {
    if (builderState.autoSave && builderState.isDirty && currentResume) {
      const timer = setTimeout(() => {
        saveResume().then(() => {
          setBuilderState(prev => ({ ...prev, isDirty: false }));
          toast.success('Resume auto-saved');
        }).catch(() => {
          toast.error('Auto-save failed');
        });
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [builderState.autoSave, builderState.isDirty, currentResume, saveResume]);

  // Section Management
  const setActiveSection = useCallback((sectionId: string | null) => {
    setBuilderState(prev => ({ ...prev, activeSection: sectionId }));
  }, []);

  const updateSection = useCallback((sectionId: string, content: any) => {
    updateResumeSection(sectionId, content);
    setBuilderState(prev => ({ ...prev, isDirty: true }));
  }, [updateResumeSection]);

  const duplicateSection = useCallback((sectionId: string) => {
    if (!currentResume) return;

    const section = currentResume.sections.find(s => s.id === sectionId);
    if (!section) return;

    const duplicatedSection = {
      ...section,
      title: `${section.title} (Copy)`,
      isVisible: true,
    };

    addSection(duplicatedSection);
    setBuilderState(prev => ({ ...prev, isDirty: true }));
    toast.success('Section duplicated');
  }, [currentResume, addSection]);

  const deleteSection = useCallback((sectionId: string) => {
    removeSection(sectionId);
    setBuilderState(prev => ({ 
      ...prev, 
      isDirty: true,
      activeSection: prev.activeSection === sectionId ? null : prev.activeSection
    }));
    toast.success('Section deleted');
  }, [removeSection]);

  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    if (!currentResume) return;

    const sections = [...currentResume.sections];
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(sections.length - 1, currentIndex + 1);

    if (newIndex !== currentIndex) {
      const [movedSection] = sections.splice(currentIndex, 1);
      sections.splice(newIndex, 0, movedSection);
      
      reorderSections(sections.map(s => s.id));
      setBuilderState(prev => ({ ...prev, isDirty: true }));
    }
  }, [currentResume, reorderSections]);

  // Template Management
  const changeTemplate = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
    if (currentResume) {
      setCurrentResume({ ...currentResume, template: templateId });
      setBuilderState(prev => ({ ...prev, isDirty: true }));
    }
  }, [selectedTemplate, currentResume, setSelectedTemplate, setCurrentResume]);

  // Preview Management
  const setPreviewMode = useCallback((mode: BuilderState['previewMode']) => {
    setBuilderState(prev => ({ ...prev, previewMode: mode }));
  }, []);

  const togglePreview = useCallback(() => {
    setBuilderState(prev => ({ ...prev, showPreview: !prev.showPreview }));
  }, []);

  // AI Integration
  const generateSectionContent = useCallback(async (
    sectionId: string,
    prompt: string
  ) => {
    if (!currentResume) return;

    try {
      const section = currentResume.sections.find(s => s.id === sectionId);
      if (!section) return;

      const content = await generateContent(section.type, prompt);
      
      // Merge generated content with existing content
      const updatedContent = {
        ...section.content,
        generated: content,
        lastGenerated: new Date().toISOString(),
      };

      updateSection(sectionId, updatedContent);
      toast.success('Content generated successfully');
    } catch (error) {
      toast.error('Failed to generate content');
    }
  }, [currentResume, generateContent, updateSection]);

  const improveSectionWithAI = useCallback(async (sectionId: string) => {
    try {
      await improveSection(sectionId);
      toast.success('Section improved with AI suggestions');
    } catch (error) {
      toast.error('Failed to improve section');
    }
  }, [improveSection]);

  const analyzeCurrentResume = useCallback(async (jobDescription?: string) => {
    try {
      await analyzeResume(jobDescription);
      toast.success('Resume analysis completed');
    } catch (error) {
      toast.error('Failed to analyze resume');
    }
  }, [analyzeResume]);

  // Export Functions
  const exportResume = useCallback(async (
    format: 'pdf' | 'docx' | 'html' | 'png',
    filename?: string
  ) => {
    try {
      switch (format) {
        case 'pdf':
          return await exportToPdf('resume-preview', filename);
        default:
          toast.error(`Export format ${format} not yet implemented`);
          return null;
      }
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
      return null;
    }
  }, [exportToPdf]);

  // Save Functions
  const saveCurrentResume = useCallback(async () => {
    try {
      await saveResume();
      setBuilderState(prev => ({ ...prev, isDirty: false }));
      toast.success('Resume saved successfully');
    } catch (error) {
      toast.error('Failed to save resume');
    }
  }, [saveResume]);

  const toggleAutoSave = useCallback(() => {
    setBuilderState(prev => ({ 
      ...prev, 
      autoSave: !prev.autoSave 
    }));
    
    toast.success(
      builderState.autoSave ? 'Auto-save disabled' : 'Auto-save enabled'
    );
  }, [builderState.autoSave]);

  // Utility Functions
  const hasUnsavedChanges = useCallback(() => {
    return builderState.isDirty;
  }, [builderState.isDirty]);

  const resetBuilder = useCallback(() => {
    setBuilderState({
      activeSection: null,
      previewMode: 'desktop',
      showPreview: true,
      autoSave: true,
      isDirty: false,
    });
  }, []);

  return {
    // State
    currentResume,
    selectedTemplate,
    builderState,
    
    // Loading states
    isAnalyzing,
    isGenerating,
    isExporting,
    
    // Section management
    setActiveSection,
    updateSection,
    duplicateSection,
    deleteSection,
    moveSection,
    
    // Template management
    changeTemplate,
    
    // Preview management
    setPreviewMode,
    togglePreview,
    
    // AI features
    generateSectionContent,
    improveSectionWithAI,
    analyzeCurrentResume,
    
    // Export functions
    exportResume,
    
    // Save functions
    saveCurrentResume,
    toggleAutoSave,
    
    // Utility functions
    hasUnsavedChanges,
    resetBuilder,
    
    // Constants
    availableTemplates: ['modern', 'classic', 'creative', 'ats-optimized'],
    previewModes: ['desktop', 'mobile', 'print'] as const,
  };
};