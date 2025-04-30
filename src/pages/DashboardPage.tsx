import React, { useEffect } from 'react';
import Navbar from '../components/dashboard/Navbar';
import SearchBar from '../components/dashboard/SearchBar';
import KanbanBoard from '../components/dashboard/KanbanBoard';
import { PlusCircle } from 'lucide-react';
import { useLeads } from '../contexts/LeadContext';
import { Lead } from '../types';

const DashboardPage: React.FC = () => {
  const { statusConfigs, addLead } = useLeads();
  
  const handleAddTestLead = () => {
    if (statusConfigs.length === 0) return;
    
    const now = new Date().toISOString();
    const firstStatus = statusConfigs.sort((a, b) => a.order - b.order)[0].name;
    
    const newLead: Lead = {
      id: Date.now().toString(),
      name: `Lead de Teste ${Math.floor(Math.random() * 1000)}`,
      phone: `(${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      status: firstStatus,
      source: 'Teste',
      entryDate: now,
      lastUpdated: now,
      notes: '',
      isNew: true,
      archived: false
    };
    
    addLead(newLead);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow p-4 sm:p-6 max-w-7xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Painel de Leads</h1>
          
          <button
            onClick={handleAddTestLead}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Adicionar Lead de Teste
          </button>
        </div>
        
        <SearchBar />
        
        <KanbanBoard />
      </div>
    </div>
  );
};

export default DashboardPage;