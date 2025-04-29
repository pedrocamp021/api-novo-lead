import React from 'react';
import Navbar from '../components/dashboard/Navbar';
import LeadDetailView from '../components/leads/LeadDetailView';

const LeadDetailPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow p-4 sm:p-6 max-w-7xl w-full mx-auto">
        <LeadDetailView />
      </div>
    </div>
  );
};

export default LeadDetailPage;