import { useState, useCallback, useEffect } from 'react';
import { useResumeStore } from '../store/resume-store';
import { toast } from 'sonner';

export interface AISuggestion {
  id: string;
  type: 'content' | 'keywords' | 'formatting' | 'structure';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  section?: string;
  originalText?: string;
  suggestedText?: string;
  impact: string;
  confidence: number;
  applied: boolean;
}

export interface SuggestionFilters {
  type?: AISuggestion['type'];
  priority?: AISuggestion['priority'];
  section?: string;
  applied?: boolean;
}

export const useAiSuggestions = () => {
  const { currentResume, analysis, updateResumeSection } = useResumeStore();
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [filters, setFilters] = useState<SuggestionFilters>({});

  // Generate suggestions from analysis
  useEffect(() => {
    if (analysis && currentResume) {
      const generatedSuggestions: AISuggestion[] = analysis.improvements.map((improvement, index) => ({
        id: `suggestion-${index}`,
        type: improvement.category as AISuggestion['type'],
        priority: improvement.priority as AISuggestion['priority'],
        title: improvement.suggestion,
        description: improvement.impact,
        impact: improvement.impact,
        confidence: 0.85, // Default confidence score
        applied: false,
      }));

      // Add keyword suggestions
      if (analysis.keywords.missing.length > 0) {
        const keywordSuggestions: AISuggestion[] = analysis.keywords.missing.slice(0, 5).map((keyword, index) => ({
          id: `keyword-${index}`,
          type: 'keywords',
          priority: 'medium',
          title: `Add "${keyword}" keyword`,
          description: `Including "${keyword}" could improve ATS compatibility`,
          section: 'skills',
          suggestedText: keyword,
          impact: 'Increases keyword match rate',
          confidence: 0.75,
          applied: false,
        }));

        generatedSuggestions.push(...keywordSuggestions);
      }

      setSuggestions(generatedSuggestions);
    }
  }, [analysis, currentResume]);

  // Get AI suggestions from API
  const getSuggestions = useCallback(async (resumeId?: string, targetRole?: string) => {
    setIsLoadingSuggestions(true);

    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Add query params if needed
      });

      if (response.ok) {
        const result = await response.json();
        
        // Transform API suggestions to our format
        const apiSuggestions: AISuggestion[] = result.data.suggestions.map((suggestion: any, index: number) => ({
          id: `api-${index}`,
          type: suggestion.type,
          priority: suggestion.priority,
          title: suggestion.message,
          description: suggestion.message,
          section: suggestion.section,
          impact: 'Improves overall quality',
          confidence: 0.8,
          applied: false,
        }));

        setSuggestions(prev => [...prev, ...apiSuggestions]);
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      toast.error('Failed to load AI suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Apply suggestion
  const applySuggestion = useCallback(async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion || !currentResume) return;

    try {
      // Handle different types of suggestions
      switch (suggestion.type) {
        case 'keywords':
          if (suggestion.section && suggestion.suggestedText) {
            const section = currentResume.sections.find(s => s.type === suggestion.section);
            if (section) {
              const updatedContent = {
                ...section.content,
                technical: [...(section.content.technical || []), suggestion.suggestedText],
              };
              updateResumeSection(section.id, updatedContent);
            }
          }
          break;

        case 'content':
          // This would typically involve more complex content modification
          // For now, just mark as applied
          break;

        case 'formatting':
        case 'structure':
          // These might require UI changes or section reordering
          break;
      }

      // Mark suggestion as applied
      setSuggestions(prev => 
        prev.map(s => 
          s.id === suggestionId ? { ...s, applied: true } : s
        )
      );

      toast.success('Suggestion applied successfully');
    } catch (error) {
      console.error('Failed to apply suggestion:', error);
      toast.error('Failed to apply suggestion');
    }
  }, [suggestions, currentResume, updateResumeSection]);

  // Dismiss suggestion
  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
    toast.success('Suggestion dismissed');
  }, []);

  // Apply all high priority suggestions
  const applyAllHighPriority = useCallback(async () => {
    const highPrioritySuggestions = suggestions.filter(
      s => s.priority === 'high' && !s.applied
    );

    for (const suggestion of highPrioritySuggestions) {
      await applySuggestion(suggestion.id);
    }

    toast.success(`Applied ${highPrioritySuggestions.length} high priority suggestions`);
  }, [suggestions, applySuggestion]);

  // Filter suggestions
  const getFilteredSuggestions = useCallback(() => {
    return suggestions.filter(suggestion => {
      if (filters.type && suggestion.type !== filters.type) return false;
      if (filters.priority && suggestion.priority !== filters.priority) return false;
      if (filters.section && suggestion.section !== filters.section) return false;
      if (filters.applied !== undefined && suggestion.applied !== filters.applied) return false;
      return true;
    });
  }, [suggestions, filters]);

  // Get suggestion stats
  const getSuggestionStats = useCallback(() => {
    const total = suggestions.length;
    const applied = suggestions.filter(s => s.applied).length;
    const byPriority = {
      high: suggestions.filter(s => s.priority === 'high').length,
      medium: suggestions.filter(s => s.priority === 'medium').length,
      low: suggestions.filter(s => s.priority === 'low').length,
    };
    const byType = {
      content: suggestions.filter(s => s.type === 'content').length,
      keywords: suggestions.filter(s => s.type === 'keywords').length,
      formatting: suggestions.filter(s => s.type === 'formatting').length,
      structure: suggestions.filter(s => s.type === 'structure').length,
    };

    return {
      total,
      applied,
      remaining: total - applied,
      completionRate: total > 0 ? Math.round((applied / total) * 100) : 0,
      byPriority,
      byType,
    };
  }, [suggestions]);

  // Clear all suggestions
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  // Refresh suggestions
  const refreshSuggestions = useCallback(async () => {
    clearSuggestions();
    await getSuggestions();
  }, [clearSuggestions, getSuggestions]);

  return {
    // State
    suggestions: getFilteredSuggestions(),
    allSuggestions: suggestions,
    isLoadingSuggestions,
    filters,

    // Actions
    getSuggestions,
    applySuggestion,
    dismissSuggestion,
    applyAllHighPriority,
    setFilters,
    clearSuggestions,
    refreshSuggestions,

    // Computed values
    suggestionStats: getSuggestionStats(),
    hasSuggestions: suggestions.length > 0,
    hasHighPrioritySuggestions: suggestions.some(s => s.priority === 'high' && !s.applied),
  };
};