import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
  remote: boolean;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'hourly' | 'monthly' | 'yearly';
  };
  description: string;
  requirements: string[];
  benefits?: string[];
  postedAt: string;
  expiresAt?: string;
  url?: string;
  source: 'indeed' | 'linkedin' | 'glassdoor' | 'manual' | 'other';
  matchScore?: number;
  bookmarked: boolean;
  applied: boolean;
  applicationDate?: string;
}

export interface SearchFilters {
  query: string;
  location: string;
  jobType: string[];
  remote: boolean | null;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: string[];
  industries: string[];
  companySize: string[];
  postedWithin: '1d' | '3d' | '1w' | '2w' | '1m' | 'any';
  skills: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  resumeId: string;
  coverLetterId?: string;
  status: 'draft' | 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  appliedAt: string;
  notes: string;
  contacts: Array<{
    name: string;
    email: string;
    role: string;
    notes?: string;
  }>;
  timeline: Array<{
    id: string;
    type: 'applied' | 'response' | 'interview' | 'offer' | 'rejection' | 'follow-up' | 'note';
    date: string;
    description: string;
    details?: any;
  }>;
  reminders: Array<{
    id: string;
    type: 'follow-up' | 'interview' | 'custom';
    date: string;
    message: string;
    completed: boolean;
  }>;
}

export interface JobAlert {
  id: string;
  name: string;
  filters: SearchFilters;
  frequency: 'daily' | 'weekly' | 'instant';
  isActive: boolean;
  createdAt: string;
  lastRun?: string;
}

export interface JobState {
  // Jobs
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  pageSize: number;
  selectedJob: Job | null;
  bookmarkedJobs: string[];

  // Search & Filters
  searchFilters: SearchFilters;
  savedSearches: Array<{ name: string; filters: SearchFilters }>;
  isSearching: boolean;
  searchHistory: string[];

  // Applications
  applications: JobApplication[];
  applicationStats: {
    total: number;
    applied: number;
    interviews: number;
    offers: number;
    rejected: number;
  };

  // Job Alerts
  jobAlerts: JobAlert[];

  // UI State
  viewMode: 'list' | 'grid' | 'map';
  sortBy: 'relevance' | 'date' | 'salary' | 'match_score';
  sortOrder: 'asc' | 'desc';
  isLoading: boolean;
  error: string | null;

  // Actions - Job Search
  searchJobs: (filters?: Partial<SearchFilters>) => Promise<void>;
  loadMoreJobs: () => Promise<void>;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  saveSearch: (name: string) => void;
  loadSavedSearch: (name: string) => void;
  deleteSavedSearch: (name: string) => void;

  // Actions - Job Management
  setSelectedJob: (job: Job | null) => void;
  bookmarkJob: (jobId: string) => void;
  unbookmarkJob: (jobId: string) => void;
  markAsApplied: (jobId: string, applicationDate?: string) => void;

  // Actions - Applications
  createApplication: (jobId: string, data: Partial<JobApplication>) => void;
  updateApplication: (applicationId: string, data: Partial<JobApplication>) => void;
  deleteApplication: (applicationId: string) => void;
  addTimelineEvent: (applicationId: string, event: Omit<JobApplication['timeline'][0], 'id'>) => void;
  addReminder: (applicationId: string, reminder: Omit<JobApplication['reminders'][0], 'id'>) => void;
  completeReminder: (applicationId: string, reminderId: string) => void;

  // Actions - Job Alerts
  createJobAlert: (alert: Omit<JobAlert, 'id' | 'createdAt'>) => void;
  updateJobAlert: (alertId: string, data: Partial<JobAlert>) => void;
  deleteJobAlert: (alertId: string) => void;
  toggleJobAlert: (alertId: string) => void;

  // Actions - UI
  setViewMode: (mode: 'list' | 'grid' | 'map') => void;
  setSorting: (sortBy: JobState['sortBy'], sortOrder?: JobState['sortOrder']) => void;
  clearError: () => void;

  // Utilities
  getJobById: (jobId: string) => Job | undefined;
  getApplicationById: (applicationId: string) => JobApplication | undefined;
  getApplicationByJobId: (jobId: string) => JobApplication | undefined;
  getJobStats: () => { totalJobs: number; appliedJobs: number; bookmarkedJobs: number };

  // Reset
  reset: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  location: '',
  jobType: [],
  remote: null,
  experienceLevel: [],
  industries: [],
  companySize: [],
  postedWithin: 'any',
  skills: [],
};

export const useJobStore = create<JobState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        jobs: [],
        totalJobs: 0,
        currentPage: 1,
        pageSize: 20,
        selectedJob: null,
        bookmarkedJobs: [],

        searchFilters: defaultFilters,
        savedSearches: [],
        isSearching: false,
        searchHistory: [],

        applications: [],
        applicationStats: {
          total: 0,
          applied: 0,
          interviews: 0,
          offers: 0,
          rejected: 0,
        },

        jobAlerts: [],

        viewMode: 'list',
        sortBy: 'relevance',
        sortOrder: 'desc',
        isLoading: false,
        error: null,

        // Job Search Actions
        searchJobs: async (newFilters) => {
          const { searchFilters } = get();
          const filters = { ...searchFilters, ...newFilters };

          set({
            isLoading: true,
            error: null,
            searchFilters: filters,
            currentPage: 1,
          });

          try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== null && value !== undefined && value !== '' &&
                  !(Array.isArray(value) && value.length === 0)) {
                if (Array.isArray(value)) {
                  queryParams.append(key, value.join(','));
                } else {
                  queryParams.append(key, value.toString());
                }
              }
            });

            const response = await fetch(`/api/jobs/search?${queryParams}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to search jobs');
            }

            const data = await response.json();

            set({
              jobs: data.jobs,
              totalJobs: data.total,
              isLoading: false,
            });

            // Add to search history
            if (filters.query && !get().searchHistory.includes(filters.query)) {
              const { searchHistory } = get();
              set({
                searchHistory: [filters.query, ...searchHistory.slice(0, 9)],
              });
            }
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Failed to search jobs',
            });
          }
        },

        loadMoreJobs: async () => {
          const { currentPage, pageSize, searchFilters, jobs, isLoading } = get();

          if (isLoading) return;

          set({ isLoading: true });

          try {
            const nextPage = currentPage + 1;
            const queryParams = new URLSearchParams();

            Object.entries({ ...searchFilters, page: nextPage, limit: pageSize }).forEach(([key, value]) => {
              if (value !== null && value !== undefined && value !== '') {
                if (Array.isArray(value)) {
                  queryParams.append(key, value.join(','));
                } else {
                  queryParams.append(key, value.toString());
                }
              }
            });

            const response = await fetch(`/api/jobs/search?${queryParams}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              },
            });

            if (!response.ok) {
              throw new Error('Failed to load more jobs');
            }

            const data = await response.json();

            set({
              jobs: [...jobs, ...data.jobs],
              currentPage: nextPage,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              isLoading: false,
              error: error.message || 'Failed to load more jobs',
            });
          }
        },

        setSearchFilters: (newFilters) => {
          const { searchFilters } = get();
          set({
            searchFilters: { ...searchFilters, ...newFilters },
          });
        },

        clearFilters: () => set({ searchFilters: defaultFilters }),

        saveSearch: (name) => {
          const { searchFilters, savedSearches } = get();
          const newSearch = { name, filters: searchFilters };

          set({
            savedSearches: [
              newSearch,
              ...savedSearches.filter(s => s.name !== name),
            ],
          });
        },

        loadSavedSearch: (name) => {
          const { savedSearches } = get();
          const search = savedSearches.find(s => s.name === name);

          if (search) {
            set({ searchFilters: search.filters });
          }
        },

        deleteSavedSearch: (name) => {
          const { savedSearches } = get();
          set({
            savedSearches: savedSearches.filter(s => s.name !== name),
          });
        },

        // Job Management Actions
        setSelectedJob: (job) => set({ selectedJob: job }),

        bookmarkJob: (jobId) => {
          const { bookmarkedJobs } = get();
          if (!bookmarkedJobs.includes(jobId)) {
            set({
              bookmarkedJobs: [...bookmarkedJobs, jobId],
            });
          }
        },

        unbookmarkJob: (jobId) => {
          const { bookmarkedJobs } = get();
          set({
            bookmarkedJobs: bookmarkedJobs.filter(id => id !== jobId),
          });
        },

        markAsApplied: (jobId, applicationDate) => {
          const { jobs } = get();
          const updatedJobs = jobs.map(job =>
            job.id === jobId
              ? {
                  ...job,
                  applied: true,
                  applicationDate: applicationDate || new Date().toISOString(),
                }
              : job
          );

          set({ jobs: updatedJobs });
        },

        // Application Actions
        createApplication: (jobId, data) => {
          const newApplication: JobApplication = {
            id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            jobId,
            resumeId: data.resumeId || '',
            status: 'draft',
            appliedAt: new Date().toISOString(),
            notes: '',
            contacts: [],
            timeline: [{
              id: `timeline-${Date.now()}`,
              type: 'applied',
              date: new Date().toISOString(),
              description: 'Application created',
            }],
            reminders: [],
            ...data,
          };

          const { applications } = get();
          set({
            applications: [...applications, newApplication],
          });

          // Update application stats
          get().updateApplicationStats();
        },

        updateApplication: (applicationId, data) => {
          const { applications } = get();
          const updatedApplications = applications.map(app =>
            app.id === applicationId ? { ...app, ...data } : app
          );

          set({ applications: updatedApplications });
          get().updateApplicationStats();
        },

        deleteApplication: (applicationId) => {
          const { applications } = get();
          set({
            applications: applications.filter(app => app.id !== applicationId),
          });
          get().updateApplicationStats();
        },

        addTimelineEvent: (applicationId, event) => {
          const { applications } = get();
          const updatedApplications = applications.map(app =>
            app.id === applicationId
              ? {
                  ...app,
                  timeline: [
                    ...app.timeline,
                    {
                      ...event,
                      id: `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    },
                  ],
                }
              : app
          );

          set({ applications: updatedApplications });
        },

        addReminder: (applicationId, reminder) => {
          const { applications } = get();
          const updatedApplications = applications.map(app =>
            app.id === applicationId
              ? {
                  ...app,
                  reminders: [
                    ...app.reminders,
                    {
                      ...reminder,
                      id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    },
                  ],
                }
              : app
          );

          set({ applications: updatedApplications });
        },

        completeReminder: (applicationId, reminderId) => {
          const { applications } = get();
          const updatedApplications = applications.map(app =>
            app.id === applicationId
              ? {
                  ...app,
                  reminders: app.reminders.map(reminder =>
                    reminder.id === reminderId
                      ? { ...reminder, completed: true }
                      : reminder
                  ),
                }
              : app
          );

          set({ applications: updatedApplications });
        },

        // Job Alert Actions
        createJobAlert: (alertData) => {
          const newAlert: JobAlert = {
            ...alertData,
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
          };

          const { jobAlerts } = get();
          set({
            jobAlerts: [...jobAlerts, newAlert],
          });
        },

        updateJobAlert: (alertId, data) => {
          const { jobAlerts } = get();
          const updatedAlerts = jobAlerts.map(alert =>
            alert.id === alertId ? { ...alert, ...data } : alert
          );

          set({ jobAlerts: updatedAlerts });
        },

        deleteJobAlert: (alertId) => {
          const { jobAlerts } = get();
          set({
            jobAlerts: jobAlerts.filter(alert => alert.id !== alertId),
          });
        },

        toggleJobAlert: (alertId) => {
          const { jobAlerts } = get();
          const updatedAlerts = jobAlerts.map(alert =>
            alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
          );

          set({ jobAlerts: updatedAlerts });
        },

        // UI Actions
        setViewMode: (mode) => set({ viewMode: mode }),

        setSorting: (sortBy, sortOrder = 'desc') => {
          set({ sortBy, sortOrder });

          // Re-sort current jobs
          const { jobs } = get();
          const sortedJobs = [...jobs].sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
              case 'date':
                aValue = new Date(a.postedAt).getTime();
                bValue = new Date(b.postedAt).getTime();
                break;
              case 'salary':
                aValue = a.salaryRange?.max || 0;
                bValue = b.salaryRange?.max || 0;
                break;
              case 'match_score':
                aValue = a.matchScore || 0;
                bValue = b.matchScore || 0;
                break;
              default: // relevance
                return 0; // Keep original order for relevance
            }

            return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
          });

          set({ jobs: sortedJobs });
        },

        clearError: () => set({ error: null }),

        // Utilities
        getJobById: (jobId) => {
          const { jobs } = get();
          return jobs.find(job => job.id === jobId);
        },

        getApplicationById: (applicationId) => {
          const { applications } = get();
          return applications.find(app => app.id === applicationId);
        },

        getApplicationByJobId: (jobId) => {
          const { applications } = get();
          return applications.find(app => app.jobId === jobId);
        },

        getJobStats: () => {
          const { jobs, applications, bookmarkedJobs } = get();
          const appliedJobs = jobs.filter(job => job.applied).length;

          return {
            totalJobs: jobs.length,
            appliedJobs,
            bookmarkedJobs: bookmarkedJobs.length,
          };
        },

        // Helper method to update application stats
        updateApplicationStats: () => {
          const { applications } = get();

          const stats = {
            total: applications.length,
            applied: applications.filter(app => app.status === 'applied').length,
            interviews: applications.filter(app => app.status === 'interview').length,
            offers: applications.filter(app => app.status === 'offer').length,
            rejected: applications.filter(app => app.status === 'rejected').length,
          };

          set({ applicationStats: stats });
        },

        // Reset
        reset: () => set({
          jobs: [],
          totalJobs: 0,
          currentPage: 1,
          selectedJob: null,
          searchFilters: defaultFilters,
          isSearching: false,
          isLoading: false,
          error: null,
        }),
      }),
      {
        name: 'job-store',
        partialize: (state) => ({
          bookmarkedJobs: state.bookmarkedJobs,
          savedSearches: state.savedSearches,
          searchHistory: state.searchHistory,
          applications: state.applications,
          jobAlerts: state.jobAlerts,
          viewMode: state.viewMode,
          sortBy: state.sortBy,
          sortOrder: state.sortOrder,
        }),
      }
    ),
    { name: 'job-store' }
  )
);

// Selectors for easier access
export const useJobs = () => useJobStore((state) => state.jobs);
export const useSelectedJob = () => useJobStore((state) => state.selectedJob);
export const useJobApplications = () => useJobStore((state) => state.applications);
export const useJobAlerts = () => useJobStore((state) => state.jobAlerts);
export const useJobLoading = () => useJobStore((state) => state.isLoading);
