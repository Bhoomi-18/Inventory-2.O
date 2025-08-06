import React from 'react';
import { MapPin, Search, Bell } from 'lucide-react';

const Header: React.FC = () => (
  <div className="bg-white border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-pink-500" />
          <select className="border-none bg-transparent text-sm font-medium">
            <option>Main Office</option>
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
        <button className="relative p-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
            NU
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Nitesh Upadhayay</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Header;