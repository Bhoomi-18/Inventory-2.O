import React, { useState, useEffect } from 'react';
import { Shield, Key, User, AlertTriangle } from 'lucide-react';

const AuthDebug: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('empcare_token');
      
      if (!token) {
        setError('No token found in localStorage');
        return;
      }

      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        setTokenInfo({
          token: token.substring(0, 20) + '...',
          payload: decodedPayload,
          expiresAt: new Date(decodedPayload.exp * 1000).toLocaleString(),
          isExpired: Date.now() > decodedPayload.exp * 1000
        });
      } catch (parseError) {
        setError('Invalid token format');
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  const testVendorEndpoint = async () => {
    try {
      const token = localStorage.getItem('empcare_token');
      const response = await fetch('http://localhost:5000/api/vendors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('Test response:', { status: response.status, data });
      
      if (response.status === 401) {
        setError('Token is invalid or expired');
      } else {
        setError(`Response: ${response.status} - ${JSON.stringify(data)}`);
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <h3 className="text-lg font-medium text-yellow-800">Auth Debug Info</h3>
      </div>
      
      <div className="space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {tokenInfo && (
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-gray-600" />
              <span>Token: {tokenInfo.token}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span>User ID: {tokenInfo.payload.id}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span>Company: {tokenInfo.payload.company}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span>Expires: {tokenInfo.expiresAt}</span>
              {tokenInfo.isExpired && (
                <span className="text-red-600 font-medium">(EXPIRED)</span>
              )}
            </div>
          </div>
        )}
        
        <button
          onClick={testVendorEndpoint}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >
          Test Vendor Endpoint
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;