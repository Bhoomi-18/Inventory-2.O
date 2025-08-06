import React from 'react';
import { Header, Sidebar } from '../common';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  </div>
);

export default Layout;