import { Lead, StatusConfig, User } from '../types';

// User storage and retrieval
export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user: User): void => {
  const users = getStoredUsers();
  const existingUserIndex = users.findIndex(u => u.email === user.email);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  localStorage.setItem('users', JSON.stringify(users));
};

export const validateUser = (email: string, password: string): User | null => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// Session management
export const saveSession = (userId: string): void => {
  localStorage.setItem('currentUser', userId);
};

export const getSession = (): string | null => {
  return localStorage.getItem('currentUser');
};

export const clearSession = (): void => {
  localStorage.removeItem('currentUser');
};

// Lead storage and retrieval
export const getStoredLeads = (): Lead[] => {
  const leads = localStorage.getItem('leads');
  return leads ? JSON.parse(leads) : [];
};

export const saveLeads = (leads: Lead[]): void => {
  localStorage.setItem('leads', JSON.stringify(leads));
};

export const addLead = (lead: Lead): void => {
  const leads = getStoredLeads();
  leads.push(lead);
  saveLeads(leads);
};

export const updateLead = (updatedLead: Lead): void => {
  const leads = getStoredLeads();
  const index = leads.findIndex(lead => lead.id === updatedLead.id);
  
  if (index !== -1) {
    leads[index] = updatedLead;
    saveLeads(leads);
  }
};

// Status configuration
export const getStatusConfigs = (): StatusConfig[] => {
  const configs = localStorage.getItem('statusConfigs');
  
  if (!configs) {
    // Default status configurations
    const defaultConfigs: StatusConfig[] = [
      { id: '1', name: 'Novo', color: '#3B82F6', order: 0 },
      { id: '2', name: 'Interessado', color: '#10B981', order: 1 },
      { id: '3', name: 'Aguardando', color: '#F59E0B', order: 2 },
      { id: '4', name: 'Desinteressado', color: '#EF4444', order: 3 },
      { id: '5', name: 'Cliente', color: '#8B5CF6', order: 4 }
    ];
    localStorage.setItem('statusConfigs', JSON.stringify(defaultConfigs));
    return defaultConfigs;
  }
  
  return JSON.parse(configs);
};

export const saveStatusConfigs = (configs: StatusConfig[]): void => {
  localStorage.setItem('statusConfigs', JSON.stringify(configs));
};

// Initialize sample data if needed
export const initializeData = (): void => {
  // Check if we have any users, if not create a sample one
  const users = getStoredUsers();
  if (users.length === 0) {
    saveUser({
      id: '1',
      email: 'admin@example.com',
      password: 'password123'
    });
  }
  
  // Initialize status configurations
  getStatusConfigs();
};