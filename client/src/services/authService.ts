import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
import type { LoginFormData, SignupFormData, AuthResponse } from '../types/auth';

class AuthService {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      if (response.success && response.data) {
        localStorage.setItem('empcare_token', response.data.token);
        localStorage.setItem('empcare_user', JSON.stringify(response.data.user));
        localStorage.setItem('empcare_company', JSON.stringify(response.data.company));
        
        return response.data;
      }

      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      console.error('Login service error:', error);
      
      if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }

  async signup(data: SignupFormData): Promise<AuthResponse> {
    try {
      const response = await httpClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.SIGNUP,
        data
      );

      if (response.success && response.data) {
        localStorage.setItem('empcare_token', response.data.token);
        localStorage.setItem('empcare_user', JSON.stringify(response.data.user));
        localStorage.setItem('empcare_company', JSON.stringify(response.data.company));
        
        return response.data;
      }

      throw new Error(response.message || 'Registration failed');
    } catch (error: any) {
      console.error('Signup service error:', error);
      
      if (error.message) {
        throw new Error(error.message);
      }
      
      throw new Error('Registration failed. Please check your information and try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('empcare_token');
      localStorage.removeItem('empcare_user');
      localStorage.removeItem('empcare_company');
    }
  }

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await httpClient.get<AuthResponse>(API_ENDPOINTS.AUTH.ME);

      if (response.success && response.data) {
        localStorage.setItem('empcare_user', JSON.stringify(response.data.user));
        localStorage.setItem('empcare_company', JSON.stringify(response.data.company));
        
        return response.data;
      }

      throw new Error(response.message || 'Failed to fetch user data');
    } catch (error: any) {
      console.error('Get current user error:', error);
      
      if (error.status === 401) {
        this.clearStorage();
      }
      
      throw new Error(error.message || 'Failed to fetch user data');
    }
  }

  async checkCompanyAvailability(companyName: string): Promise<boolean> {
    try {
      const response = await httpClient.get<{ available: boolean }>(
        `${API_ENDPOINTS.AUTH.CHECK_COMPANY}?companyName=${encodeURIComponent(companyName)}`
      );

      return response.success && response.data ? response.data.available : true;
    } catch (error: any) {
      console.error('Error checking company availability:', error);
      
      if (error.status === 404) {
        return true;
      }
      
      return true;
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('empcare_token');
  }

  getStoredUser(): any | null {
    try {
      const user = localStorage.getItem('empcare_user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  getStoredCompany(): any | null {
    try {
      const company = localStorage.getItem('empcare_company');
      return company ? JSON.parse(company) : null;
    } catch (error) {
      console.error('Error parsing stored company:', error);
      return null;
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('empcare_token');
    localStorage.removeItem('empcare_user');
    localStorage.removeItem('empcare_company');
  }
}

const authService = new AuthService();
export default authService;