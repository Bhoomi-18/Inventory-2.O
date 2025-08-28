export interface ApiError {
  status?: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
  company: any;
  loading: boolean;
  error: string | null;
}

export const handleApiError = (error: any): string => {
  if (error.message) {
    return error.message;
  }

  if (error.status) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

export const getFieldErrors = (authState: AuthState): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  
  if (authState.error) {
    if (authState.error.toLowerCase().includes('email')) {
      fieldErrors.email = authState.error;
    } else if (authState.error.toLowerCase().includes('password')) {
      fieldErrors.password = authState.error;
    } else if (authState.error.toLowerCase().includes('company')) {
      fieldErrors.companyName = authState.error;
    }
  }
  
  return fieldErrors;
};