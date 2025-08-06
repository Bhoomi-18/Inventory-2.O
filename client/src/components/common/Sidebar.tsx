import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Package, 
  Users, 
  Building, 
  Wrench, 
  FileText, 
  BarChart3, 
  Settings, 
  MapPin,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'assignments', label: 'Assignments', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Building },
    { id: 'repairs', label: 'Repairs', icon: Wrench },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Users & Roles', icon: User },
    { id: 'offices', label: 'Offices', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Empcare</h1>
            <p className="text-xs text-gray-500">Enterprise</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;