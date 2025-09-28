import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type SidebarState = 'expanded' | 'collapsed' | 'hidden';
export type ViewMode = 'list' | 'grid' | 'card';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, null for persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: string;
}

export interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
  isActive?: boolean;
}

export interface UIState {
  // Theme & Appearance
  theme: Theme;
  sidebarState: SidebarState;
  isFullscreen: boolean;

  // Layout & Navigation
  pageTitle: string;
  breadcrumbs: Breadcrumb[];
  activeRoute: string;

  // View Settings
  viewMode: ViewMode;
  density: 'compact' | 'comfortable' | 'spacious';

  // Loading States
  globalLoading: boolean;
  loadingTasks: Set<string>;

  // Notifications
  notifications: Notification[];
  unreadCount: number;

  // Modals & Overlays
  modals: Modal[];
  activeModal: string | null;

  // Search & Filters
  globalSearchQuery: string;
  quickFilters: Record<string, any>;

  // User Preferences
  preferences: {
    animations: boolean;
    soundEffects: boolean;
    compactMode: boolean;
    showHelpTips: boolean;
    autoSave: boolean;
    language: string;
  };

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarState: (state: SidebarState) => void;
  toggleFullscreen: () => void;

  // Navigation
  setPageTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void;
  setActiveRoute: (route: string) => void;

  // View Settings
  setViewMode: (mode: ViewMode) => void;
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;

  // Loading Management
  startLoading: (taskId?: string) => void;
  stopLoading: (taskId?: string) => void;
  isLoading: (taskId?: string) => boolean;

  // Notification Management
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;

  // Modal Management
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Search & Filters
  setGlobalSearchQuery: (query: string) => void;
  setQuickFilter: (key: string, value: any) => void;
  clearQuickFilters: () => void;

  // Preferences
  updatePreferences: (preferences: Partial<UIState['preferences']>) => void;
  resetPreferences: () => void;

  // Utilities
  reset: () => void;
}

const defaultPreferences: UIState['preferences'] = {
  animations: true,
  soundEffects: false,
  compactMode: false,
  showHelpTips: true,
  autoSave: true,
  language: 'en',
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        theme: 'system',
        sidebarState: 'expanded',
        isFullscreen: false,

        pageTitle: '',
        breadcrumbs: [],
        activeRoute: '/',

        viewMode: 'list',
        density: 'comfortable',

        globalLoading: false,
        loadingTasks: new Set(),

        notifications: [],
        unreadCount: 0,

        modals: [],
        activeModal: null,

        globalSearchQuery: '',
        quickFilters: {},

        preferences: defaultPreferences,

        // Theme & Appearance Actions
        setTheme: (theme) => {
          set({ theme });

          // Apply theme to document
          if (typeof window !== 'undefined') {
            const root = document.documentElement;

            if (theme === 'system') {
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              root.classList.toggle('dark', systemTheme === 'dark');
            } else {
              root.classList.toggle('dark', theme === 'dark');
            }
          }
        },

        toggleSidebar: () => {
          const { sidebarState } = get();
          const newState = sidebarState === 'expanded' ? 'collapsed' : 'expanded';
          set({ sidebarState: newState });
        },

        setSidebarState: (state) => set({ sidebarState: state }),

        toggleFullscreen: () => {
          const { isFullscreen } = get();

          if (typeof window !== 'undefined') {
            if (!isFullscreen) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }

          set({ isFullscreen: !isFullscreen });
        },

        // Navigation Actions
        setPageTitle: (title) => set({ pageTitle: title }),
        setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
        setActiveRoute: (route) => set({ activeRoute: route }),

        // View Settings Actions
        setViewMode: (mode) => set({ viewMode: mode }),
        setDensity: (density) => set({ density }),

        // Loading Management
        startLoading: (taskId) => {
          if (taskId) {
            const { loadingTasks } = get();
            const newTasks = new Set(loadingTasks);
            newTasks.add(taskId);
            set({ loadingTasks: newTasks, globalLoading: newTasks.size > 0 });
          } else {
            set({ globalLoading: true });
          }
        },

        stopLoading: (taskId) => {
          if (taskId) {
            const { loadingTasks } = get();
            const newTasks = new Set(loadingTasks);
            newTasks.delete(taskId);
            set({ loadingTasks: newTasks, globalLoading: newTasks.size > 0 });
          } else {
            set({ globalLoading: false, loadingTasks: new Set() });
          }
        },

        isLoading: (taskId) => {
          const { globalLoading, loadingTasks } = get();
          return taskId ? loadingTasks.has(taskId) : globalLoading;
        },

        // Notification Management
        addNotification: (notificationData) => {
          const notification: Notification = {
            ...notificationData,
            id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
          };

          const { notifications, unreadCount } = get();

          set({
            notifications: [notification, ...notifications],
            unreadCount: unreadCount + 1,
          });

          // Auto-remove notification if duration is specified
          if (notification.duration) {
            setTimeout(() => {
              get().removeNotification(notification.id);
            }, notification.duration);
          }

          return notification.id;
        },

        removeNotification: (id) => {
          const { notifications } = get();
          set({
            notifications: notifications.filter(n => n.id !== id),
          });
        },

        clearNotifications: () => set({ notifications: [], unreadCount: 0 }),

        markAsRead: (id) => {
          const { notifications, unreadCount } = get();
          const notification = notifications.find(n => n.id === id);

          if (notification) {
            set({ unreadCount: Math.max(0, unreadCount - 1) });
          }
        },

        // Modal Management
        openModal: (modalData) => {
          const modal: Modal = {
            ...modalData,
            id: `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          };

          const { modals } = get();

          set({
            modals: [...modals, modal],
            activeModal: modal.id,
          });

          return modal.id;
        },

        closeModal: (id) => {
          const { modals, activeModal } = get();
          const updatedModals = modals.filter(m => m.id !== id);

          set({
            modals: updatedModals,
            activeModal: activeModal === id ? (updatedModals[updatedModals.length - 1]?.id || null) : activeModal,
          });
        },

        closeAllModals: () => set({ modals: [], activeModal: null }),

        // Search & Filters
        setGlobalSearchQuery: (query) => set({ globalSearchQuery: query }),

        setQuickFilter: (key, value) => {
          const { quickFilters } = get();
          set({
            quickFilters: {
              ...quickFilters,
              [key]: value,
            },
          });
        },

        clearQuickFilters: () => set({ quickFilters: {} }),

        // Preferences
        updatePreferences: (newPreferences) => {
          const { preferences } = get();
          set({
            preferences: {
              ...preferences,
              ...newPreferences,
            },
          });
        },

        resetPreferences: () => set({ preferences: defaultPreferences }),

        // Utilities
        reset: () => set({
          pageTitle: '',
          breadcrumbs: [],
          globalLoading: false,
          loadingTasks: new Set(),
          notifications: [],
          unreadCount: 0,
          modals: [],
          activeModal: null,
          globalSearchQuery: '',
          quickFilters: {},
        }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          sidebarState: state.sidebarState,
          viewMode: state.viewMode,
          density: state.density,
          preferences: state.preferences,
        }),
      }
    ),
    { name: 'ui-store' }
  )
);

// Selectors for easier access
export const useTheme = () => useUIStore((state) => state.theme);
export const useSidebarState = () => useUIStore((state) => state.sidebarState);
export const useNotifications = () => useUIStore((state) => state.notifications);
export const useGlobalLoading = () => useUIStore((state) => state.globalLoading);
export const useModals = () => useUIStore((state) => state.modals);
