import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Building, Mail, Lock, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signupSchema, type SignupFormData } from '../../schemas/authSchema';
import { getFieldErrors } from '../../utils/errorHandler';

interface SignupProps {
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const { signup, authState, checkCompanyExists } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    companyName: '',
    adminEmail: '',
    adminPassword: '',
    generalPassword: ''
  });
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showGeneralPassword, setShowGeneralPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [companyCheckState, setCompanyCheckState] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    hasChecked: boolean;
  }>({
    isChecking: false,
    isAvailable: null,
    hasChecked: false
  });

  useEffect(() => {
    if (!authState.error) {
      setErrors({});
    }
  }, [authState.error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    if (name === 'companyName') {
      setCompanyCheckState({ 
        isChecking: false, 
        isAvailable: null,
        hasChecked: false 
      });
    }
  };

  const handleCompanyNameBlur = async () => {
    const companyName = formData.companyName.trim();
    
    if (companyName && companyName.length >= 2 && !errors.companyName && !companyCheckState.hasChecked) {
      setCompanyCheckState({ 
        isChecking: true, 
        isAvailable: null,
        hasChecked: false 
      });
      
      try {
        const exists = await checkCompanyExists(companyName);
        
        setCompanyCheckState({ 
          isChecking: false, 
          isAvailable: !exists, 
          hasChecked: true
        });
        
        if (exists) {
          setErrors(prev => ({ 
            ...prev, 
            companyName: 'Company name already exists. Please choose a different name.' 
          }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.companyName;
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Error checking company availability:', error);
        setCompanyCheckState({ 
          isChecking: false, 
          isAvailable: true, 
          hasChecked: true
        });
      }
    }
  };

  const validateForm = (): boolean => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Partial<SignupFormData> = {};
      error.errors.forEach((err: any) => {
        const field = err.path[0] as keyof SignupFormData;
        newErrors[field] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (companyCheckState.isAvailable === false) {
      setErrors(prev => ({ 
        ...prev, 
        companyName: 'Company name already exists. Please choose a different name.' 
      }));
      return;
    }

    if (!companyCheckState.hasChecked && formData.companyName.trim()) {
      await handleCompanyNameBlur();
      return;
    }

    const success = await signup(formData);
    if (!success && authState.error) {
      const fieldErrors = getFieldErrors(authState);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
    }
  };

  const renderCompanyNameStatus = () => {
    if (companyCheckState.isChecking) {
      return (
        <div className="flex items-center text-sm text-blue-600 mt-1">
          <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
          Checking availability...
        </div>
      );
    }
    
    if (companyCheckState.isAvailable === true && companyCheckState.hasChecked) {
      return (
        <div className="flex items-center text-sm text-green-600 mt-1">
          <CheckCircle className="w-4 h-4 mr-1" />
          Company name is available
        </div>
      );
    }
    
    if (companyCheckState.isAvailable === false && companyCheckState.hasChecked) {
      return (
        <div className="flex items-center text-sm text-red-600 mt-1">
          <AlertCircle className="w-4 h-4 mr-1" />
          Company name is already taken
        </div>
      );
    }
    
    return null;
  };

  const isSubmitDisabled = () => {
    return (
      authState.loading || 
      companyCheckState.isChecking || 
      (companyCheckState.hasChecked && companyCheckState.isAvailable === false) ||
      Object.keys(errors).length > 0
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Register your company with Empcare</p>
        </div>

        {/* Error Message */}
        {authState.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{authState.error}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name Field */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                onBlur={handleCompanyNameBlur}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.companyName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your company name"
                disabled={authState.loading}
                autoComplete="organization"
              />
            </div>
            {errors.companyName && (
              <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>
            )}
            {renderCompanyNameStatus()}
          </div>

          {/* Admin Email Field */}
          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="adminEmail"
                name="adminEmail"
                value={formData.adminEmail}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.adminEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter admin email"
                disabled={authState.loading}
                autoComplete="email"
              />
            </div>
            {errors.adminEmail && (
              <p className="text-sm text-red-600 mt-1">{errors.adminEmail}</p>
            )}
          </div>

          {/* Admin Password Field */}
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showAdminPassword ? 'text' : 'password'}
                id="adminPassword"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.adminPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter admin password"
                disabled={authState.loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowAdminPassword(!showAdminPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={authState.loading}
                tabIndex={-1}
              >
                {showAdminPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.adminPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.adminPassword}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Must contain uppercase, lowercase, and number
            </p>
          </div>

          {/* General Password Field */}
          <div>
            <label htmlFor="generalPassword" className="block text-sm font-medium text-gray-700 mb-2">
              General User Password
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showGeneralPassword ? 'text' : 'password'}
                id="generalPassword"
                name="generalPassword"
                value={formData.generalPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                  errors.generalPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter general user password"
                disabled={authState.loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowGeneralPassword(!showGeneralPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={authState.loading}
                tabIndex={-1}
              >
                {showGeneralPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.generalPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.generalPassword}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Password for all employees in your company
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitDisabled()}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {authState.loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : companyCheckState.isChecking ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Checking Company...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-700 font-medium focus:outline-none focus:underline"
              disabled={authState.loading}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;