import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MedicalDisclaimer from './MedicalDisclaimer';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-wrapper">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isDashboard={true} />

        <main className="content-body">
          {children}
          <div style={{ marginTop: '48px' }}>
            <MedicalDisclaimer compact={true} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
