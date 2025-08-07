import React, { useState } from 'react';
import { Layout } from './components/layout';
import { Dashboard } from './components/dashboard';
import { Inventory } from './components/inventory';
import { Assignments } from './components/assignments';
import { Vendors } from './components/vendors';
import { Repairs } from './components/repairs';
import { Reports } from './components/reports';
import { Invoices } from './components/invoices';
import { Users } from './components/users';
import { Offices } from './components/offices';
import { Settings } from './components/settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'assignments':
        return <Assignments />;
      case 'vendors':
        return <Vendors />;
      case 'repairs':
        return <Repairs />;
      case 'reports':
        return <Reports />;
      case 'invoices':
        return <Invoices />;
      case 'users':
        return <Users />;
      case 'offices':
        return <Offices />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="p-6">
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
              </h2>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;