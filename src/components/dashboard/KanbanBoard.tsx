import React from 'react';
import { useLeads } from '../../contexts/LeadContext';
import StatusColumn from './StatusColumn';

const KanbanBoard: React.FC = () => {
  const { statusConfigs } = useLeads();
  
  // Sort status configs by order
  const sortedConfigs = [...statusConfigs].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-full">
        {sortedConfigs.map(statusConfig => (
          <StatusColumn 
            key={statusConfig.id} 
            statusConfig={statusConfig} 
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;