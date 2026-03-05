import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

// Augment axios config to allow metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    metadata?: { startTime: number };
  }
}

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
  timestamp: string;
}

// Configuration interface
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

class ApiClient {
  private client: AxiosInstance;
  private config: ApiClientConfig;
  private authToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 30000, // 30 seconds
      retries: 3,
      retryDelay: 1000,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadStoredToken();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Add request timestamp
        config.metadata = { startTime: Date.now() };

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response time for debugging
        const endTime = Date.now();
        const startTime = response.config.metadata?.startTime || endTime;
        const responseTime = endTime - startTime;

        if (process.env.NODE_ENV === 'development') {
          console.log(
            `API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${responseTime}ms)`
          );
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
          toast.error('Network error. Please check your connection.');
          return Promise.reject(new Error('Network error'));
        }

        const { status, data } = error.response;

        // Handle 401 Unauthorized
        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAuthToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthError();
            return Promise.reject(refreshError);
          }
        }

        // Handle 403 Forbidden
        if (status === 403) {
          toast.error('Access denied. You do not have permission to perform this action.');
        }

        // Handle 404 Not Found
        if (status === 404) {
          console.warn(`Resource not found: ${originalRequest.url}`);
        }

        // Handle 429 Too Many Requests
        if (status === 429) {
          toast.error('Too many requests. Please wait a moment before trying again.');

          // Implement exponential backoff
          const retryAfter = error.response.headers['retry-after'] || this.config.retryDelay;
          await this.delay(parseInt(retryAfter) * 1000);

          if (!originalRequest._retryCount) {
            originalRequest._retryCount = 0;
          }

          if (originalRequest._retryCount < this.config.retries) {
            originalRequest._retryCount++;
            return this.client(originalRequest);
          }
        }

        // Handle 500+ Server Errors
        if (status >= 500) {
          toast.error('Server error. Please try again later.');

          // Retry logic for server errors
          if (!originalRequest._retryCount) {
            originalRequest._retryCount = 0;
          }

          if (originalRequest._retryCount < this.config.retries) {
            originalRequest._retryCount++;
            await this.delay(this.config.retryDelay * Math.pow(2, originalRequest._retryCount));
            return this.client(originalRequest);
          }
        }

        // Handle validation errors (400)
        if (status === 400 && data?.message) {
          toast.error(data.message);
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private formatError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        statusCode: error.response.status,
        error: error.response.data?.error || 'Unknown Error',
        timestamp: new Date().toISOString(),
      };
    }

    return {
      message: error.message || 'Network error',
      statusCode: 0,
      error: 'NetworkError',
      timestamp: new Date().toISOString(),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private loadStoredToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        this.authToken = token;
      }
    }
  }

  private async refreshAuthToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise as unknown as Promise<string | null>;
    }

    this.refreshPromise = this.performTokenRefresh() as unknown as Promise<string>;

    try {
      const newToken = await this.refreshPromise;
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${this.config.baseURL}/auth/refresh`, {
        refreshToken,
      });

      const { accessToken } = response.data;
      this.setAuthToken(accessToken);

      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  }

  private handleAuthError() {
    this.clearAuth();

    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  // Public methods
  public setAuthToken(token: string) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  public clearAuth() {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  }

  public setRefreshToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refresh_token', token);
    }
  }

  // HTTP Methods
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // File upload method
  public async upload<T = any>(
    url: string,
    file: File | FormData,
    onUploadProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();

    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      ...config,
    });
  }

  // Download method
  public async download(
    url: string,
    filename?: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    try {
      const response = await this.client.get(url, {
        responseType: 'blob',
        ...config,
      });

      // Create download link
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = filename || this.extractFilenameFromResponse(response) || 'download';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);

      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download file');
      throw error;
    }
  }

  private extractFilenameFromResponse(response: AxiosResponse): string | null {
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        return filenameMatch[1].replace(/['"]/g, '');
      }
    }
    return null;
  }

  // Batch requests
  public async batch<T = any>(
    requests: Array<{
      method: 'get' | 'post' | 'put' | 'patch' | 'delete';
      url: string;
      data?: any;
      config?: AxiosRequestConfig;
    }>
  ): Promise<AxiosResponse<T>[]> {
    const promises = requests.map(request => {
      switch (request.method) {
        case 'get':
          return this.get<T>(request.url, request.config);
        case 'post':
          return this.post<T>(request.url, request.data, request.config);
        case 'put':
          return this.put<T>(request.url, request.data, request.config);
        case 'patch':
          return this.patch<T>(request.url, request.data, request.config);
        case 'delete':
          return this.delete<T>(request.url, request.config);
        default:
          throw new Error(`Unsupported method: ${request.method}`);
      }
    });

    return Promise.all(promises);
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Request cancellation
  public createCancelToken() {
    return axios.CancelToken.source();
  }

  public isCancel(error: any): boolean {
    return axios.isCancel(error);
  }

  // Configuration methods
  public updateConfig(newConfig: Partial<ApiClientConfig>) {
    this.config = { ...this.config, ...newConfig };

    // Update axios instance
    this.client.defaults.baseURL = this.config.baseURL;
    this.client.defaults.timeout = this.config.timeout;
  }

  public getConfig(): ApiClientConfig {
    return { ...this.config };
  }

  // Debug methods (development only)
  public enableDebugMode() {
    if (process.env.NODE_ENV === 'development') {
      this.client.interceptors.request.use(request => {
        console.log('Starting Request:', {
          method: request.method?.toUpperCase(),
          url: request.url,
          data: request.data,
          headers: request.headers,
        });
        return request;
      });

      this.client.interceptors.response.use(
        response => {
          console.log('Response:', {
            status: response.status,
            data: response.data,
            headers: response.headers,
          });
          return response;
        },
        error => {
          console.log('Response Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
          });
          return Promise.reject(error);
        }
      );
    }
  }

  // Connection status monitoring
  public async checkConnection(): Promise<{
    online: boolean;
    latency?: number;
    timestamp: string;
  }> {
    const startTime = Date.now();

    try {
      await this.healthCheck();
      const latency = Date.now() - startTime;

      return {
        online: true,
        latency,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        online: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Rate limiting info
  public getRateLimitInfo(response: AxiosResponse): {
    limit?: number;
    remaining?: number;
    reset?: Date;
  } {
    const headers = response.headers;

    return {
      limit: headers['x-ratelimit-limit'] ? parseInt(headers['x-ratelimit-limit']) : undefined,
      remaining: headers['x-ratelimit-remaining'] ? parseInt(headers['x-ratelimit-remaining']) : undefined,
      reset: headers['x-ratelimit-reset'] ? new Date(parseInt(headers['x-ratelimit-reset']) * 1000) : undefined,
    };
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();

// Enable debug mode in development
if (process.env.NODE_ENV === 'development') {
  apiClient.enableDebugMode();
}

export { apiClient };
export default apiClient;

// Export types for use in other files (interfaces already exported above)

// Utility functions
export const createApiClient = (config?: Partial<ApiClientConfig>) => {
  return new ApiClient(config);
};

export const isApiError = (error: any): error is ApiError => {
  return error && typeof error === 'object' && 'statusCode' in error && 'message' in error;
};

// Request/Response logging utility
export const withLogging = <T extends (...args: any[]) => Promise<any>>(
  apiMethod: T,
  context: string
): T => {
  return (async (...args: any[]) => {
    const startTime = Date.now();

    try {
      console.log(`[${context}] Starting API call...`);
      const result = await apiMethod(...args);
      const duration = Date.now() - startTime;
      console.log(`[${context}] API call completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[${context}] API call failed after ${duration}ms:`, error);
      throw error;
    }
  }) as T;
};

// Environment-specific configurations
export const getApiConfig = (): Partial<ApiClientConfig> => {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'production':
      return {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.careercraft.ai',
        timeout: 30000,
        retries: 3,
        retryDelay: 1000,
      };
    case 'test':
      return {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://staging-api.careercraft.ai',
        timeout: 30000,
        retries: 2,
        retryDelay: 500,
      };
    default: // development
      return {
        baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        timeout: 60000,
        retries: 1,
        retryDelay: 1000,
      };
  }
};

// Initialize with environment-specific config
apiClient.updateConfig(getApiConfig());
