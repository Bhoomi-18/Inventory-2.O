import { API_BASE_URL } from '../config/api';

interface RequestConfig extends RequestInit {
  timeout?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class HttpClient {
  private baseURL: string;
  private defaultTimeout: number = 30000;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    try {
      return localStorage.getItem('empcare_token');
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private handleAuthError(): void {
    try {
      localStorage.removeItem('empcare_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.warn('Error handling auth error:', error);
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, ...requestConfig } = config;
    
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(requestConfig.headers as Record<string, string>),
    };

    if (token && !this.isTokenExpired(token)) {
      headers.Authorization = `Bearer ${token}`;
    } else if (token && this.isTokenExpired(token)) {
      this.handleAuthError();
      throw new Error('Authentication token has expired. Please login again.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...requestConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        data = { 
          success: response.ok, 
          message: textResponse || `HTTP ${response.status}` 
        };
      }

      if (!response.ok) {
        if (response.status === 401) {
          this.handleAuthError();
          throw new Error(data.message || 'Authentication failed. Please login again.');
        }
        
        const error = {
          status: response.status,
          message: data.message || `HTTP ${response.status} - ${response.statusText}`,
          errors: data.errors || []
        };
        
        throw error;
      }

      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }

      if (!error.status) {
        throw new Error('Network error. Please check your connection and try again.');
      }
      
      throw error;
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...config, method: 'DELETE' });
  }

  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    return token !== null && !this.isTokenExpired(token);
  }

  getUserInfo(): any {
    const token = this.getAuthToken();
    if (!token || this.isTokenExpired(token)) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.userId,
        companyId: payload.companyId,
        role: payload.role,
        email: payload.email,
        companyName: payload.companyName
      };
    } catch (error) {
      return null;
    }
  }
}

const httpClient = new HttpClient(API_BASE_URL);
export default httpClient;