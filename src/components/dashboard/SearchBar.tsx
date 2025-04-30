import React from 'react';
import { useLeads } from '../../contexts/LeadContext';
import { Search, X } from 'lucide-react';

const SearchBar: React.FC = () => {
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, statusConfigs } = useLeads();

  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar leads por nome ou telefone..."
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      <div className="w-full sm:w-64">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos os status</option>
          {statusConfigs
            .sort((a, b) => a.order - b.order)
            .map((config) => (
              <option key={config.id} value={config.name}>
                {config.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;