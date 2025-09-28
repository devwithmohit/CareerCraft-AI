import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useJobStore } from '@/store/job-store';
import type { Job, SearchFilters, JobApplication } from '@/store/job-store';

// Job search hook
export function useJobSearch() {
  const { searchFilters, isLoading } = useJobStore();

  return useQuery({
    queryKey: ['jobs', 'search', searchFilters],
    queryFn: async () => {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(searchFilters),
      });

      if (!response.ok) {
        throw new Error('Failed to search jobs');
      }

      return response.json();
    },
    enabled: !!searchFilters.query || Object.values(searchFilters).some(Boolean),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Job applications hook
export function useJobApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      return response.json();
    },
  });
}

// Create application mutation
export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<JobApplication>) => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
