import React from 'react';
import { StatusConfig } from '../../types';
import { useLeads } from '../../contexts/LeadContext';
import LeadCard from './LeadCard';

interface StatusColumnProps {
  statusConfig: StatusConfig;
}

const StatusColumn: React.FC<StatusColumnProps> = ({ statusConfig }) => {
  const { getLeadsByStatus, getCountByStatus } = useLeads();
  const leads = getLeadsByStatus(statusConfig.name);
  const count = getCountByStatus(statusConfig.name);

  return (
    <div className="w-full md:w-72 shrink-0 flex flex-col bg-gray-50 rounded-lg shadow-sm p-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div 
            className="h-3 w-3 rounded-full mr-2" 
            style={{ backgroundColor: statusConfig.color }}
          ></div>
          <h3 className="font-medium text-gray-900">{statusConfig.name}</h3>
        </div>
        <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">
          {count}
        </span>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {leads.length === 0 ? (
          <div className="text-center py-4 text-sm text-gray-500">
            Nenhum lead neste status
          </div>
        ) : (
          leads.map(lead => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              statusConfig={statusConfig} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StatusColumn;