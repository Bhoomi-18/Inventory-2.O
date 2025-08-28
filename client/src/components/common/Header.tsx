import React, { useEffect, useState } from 'react';
import { MapPin, Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useOffices } from '../../hooks/useOffice';

const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const { offices } = useOffices();
  const [selectedOffice, setSelectedOffice] = useState<string>('Main Office');

  useEffect(() => {
    if (offices.length > 0) {
      setSelectedOffice(offices.find(o => o.isMain)?.name || offices[0].name);
    }
  }, [offices]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserInitial = () => {
    return authState.user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-500" />
            <select
              className="border-none bg-transparent text-sm font-medium"
              value={selectedOffice}
              onChange={e => setSelectedOffice(e.target.value)}
            >
              {offices.map(office => (
                <option key={office.id} value={office.name}>{office.name}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search assets, vendors, users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-96 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {getUserInitial()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{authState.user?.email}</p>
              <p className="text-xs text-gray-500">
                {authState.user?.role ? formatRole(authState.user.role) : 'User'} • {authState.company?.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;