import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, StatusConfig } from '../types';
import { getStoredLeads, saveLeads, getStatusConfigs, saveStatusConfigs } from '../utils/localStorage';

interface LeadContextType {
  leads: Lead[];
  filteredLeads: Lead[];
  statusConfigs: StatusConfig[];
  searchTerm: string;
  statusFilter: string;
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  archiveLead: (id: string) => void;
  setLeadAsViewed: (id: string) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: string) => void;
  updateStatusConfig: (config: StatusConfig) => void;
  addStatusConfig: (config: StatusConfig) => void;
  removeStatusConfig: (id: string) => void;
  getLeadsByStatus: (status: string) => Lead[];
  getLeadById: (id: string) => Lead | undefined;
  getCountByStatus: (status: string) => number;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export const LeadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusConfigs, setStatusConfigs] = useState<StatusConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);

  // Load initial data
  useEffect(() => {
    const storedLeads = getStoredLeads();
    const storedConfigs = getStatusConfigs();
    setLeads(storedLeads);
    setStatusConfigs(storedConfigs);
  }, []);

  // Update filtered leads when leads, search term, or status filter changes
  useEffect(() => {
    let result = [...leads].filter(lead => !lead.archived);
    
    if (searchTerm) {
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }
    
    if (statusFilter) {
      result = result.filter(lead => lead.status === statusFilter);
    }
    
    setFilteredLeads(result);
  }, [leads, searchTerm, statusFilter]);

  // Methods for lead management
  const addLead = (lead: Lead) => {
    const updatedLeads = [...leads, lead];
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
  };

  const updateLead = (updatedLead: Lead) => {
    const updatedLeads = leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    );
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
  };

  const archiveLead = (id: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === id ? { ...lead, archived: true } : lead
    );
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
  };

  const setLeadAsViewed = (id: string) => {
    const updatedLeads = leads.map(lead => 
      lead.id === id && lead.isNew ? { ...lead, isNew: false } : lead
    );
    setLeads(updatedLeads);
    saveLeads(updatedLeads);
  };

  // Status configuration methods
  const updateStatusConfig = (updatedConfig: StatusConfig) => {
    const updatedConfigs = statusConfigs.map(config => 
      config.id === updatedConfig.id ? updatedConfig : config
    );
    setStatusConfigs(updatedConfigs);
    saveStatusConfigs(updatedConfigs);
  };

  const addStatusConfig = (newConfig: StatusConfig) => {
    const updatedConfigs = [...statusConfigs, newConfig];
    setStatusConfigs(updatedConfigs);
    saveStatusConfigs(updatedConfigs);
  };

  const removeStatusConfig = (id: string) => {
    const updatedConfigs = statusConfigs.filter(config => config.id !== id);
    setStatusConfigs(updatedConfigs);
    saveStatusConfigs(updatedConfigs);
  };

  // Helper methods
  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status && !lead.archived);
  };

  const getLeadById = (id: string) => {
    return leads.find(lead => lead.id === id);
  };

  const getCountByStatus = (status: string) => {
    return leads.filter(lead => lead.status === status && !lead.archived).length;
  };

  return (
    <LeadContext.Provider value={{
      leads,
      filteredLeads,
      statusConfigs,
      searchTerm,
      statusFilter,
      addLead,
      updateLead,
      archiveLead,
      setLeadAsViewed,
      setSearchTerm,
      setStatusFilter,
      updateStatusConfig,
      addStatusConfig,
      removeStatusConfig,
      getLeadsByStatus,
      getLeadById,
      getCountByStatus
    }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};