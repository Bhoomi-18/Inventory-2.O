import { useState, useEffect, useContext, createContext, type ReactNode } from 'react';
import authService from '../services/authService';
import type { AuthState, LoginFormData, SignupFormData } from '../types/auth';

const AuthContext = createContext<{
  authState: AuthState;
  login: (data: LoginFormData) => Promise<boolean>;
  signup: (data: SignupFormData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkCompanyExists: (companyName: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    company: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getStoredToken();
      
      if (token) {
        try {
          const authData = await authService.getCurrentUser();
          
          setAuthState({
            isAuthenticated: true,
            user: authData.user,
            company: authData.company,
            loading: false,
            error: null
          });
        } catch (error: any) {
          console.error('Auth initialization error:', error);
          await authService.logout();
          setAuthState({
            isAuthenticated: false,
            user: null,
            company: null,
            loading: false,
            error: null
          });
        }
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginFormData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const authData = await authService.login(data);
      
      setAuthState({
        isAuthenticated: true,
        user: authData.user,
        company: authData.company,
        loading: false,
        error: null
      });

      return true;
    } catch (error: any) {
      console.error('Login error in useAuth:', error);
      const errorMessage = error.message || 'Login failed. Please try again.';
      
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      
      return false;
    }
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const authData = await authService.signup(data);
      
      setAuthState({
        isAuthenticated: true,
        user: authData.user,
        company: authData.company,
        loading: false,
        error: null
      });

      return true;
    } catch (error: any) {
      console.error('Signup error in useAuth:', error);
      const errorMessage = error.message || 'Registration failed. Please try again.';
      
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
        user: null,
        company: null,
        loading: false,
        error: null
      });
    }
  };

  const checkCompanyExists = async (companyName: string): Promise<boolean> => {
    try {
      const available = await authService.checkCompanyAvailability(companyName);
      return !available;
    } catch (error) {
      console.error('Error checking company:', error);
      return false;
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!authState.isAuthenticated) return;

    try {
      const authData = await authService.getCurrentUser();
      
      setAuthState(prev => ({
        ...prev,
        user: authData.user,
        company: authData.company
      }));
    } catch (error) {
      console.error('Error refreshing user:', error);
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      authState,
      login,
      signup,
      logout,
      checkCompanyExists,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};