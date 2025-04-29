import React from 'react';
import { Lead, StatusConfig } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadContext';
import { Phone, Calendar } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  statusConfig: StatusConfig;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, statusConfig }) => {
  const navigate = useNavigate();
  const { setLeadAsViewed } = useLeads();
  
  const handleClick = () => {
    if (lead.isNew) {
      setLeadAsViewed(lead.id);
    }
    navigate(`/lead/${lead.id}`);
  };
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        bg-white rounded-lg shadow-sm p-4 mb-3 cursor-pointer border-l-4
        hover:shadow-md transition-shadow duration-200
        ${lead.isNew ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
      `}
      style={{ borderLeftColor: statusConfig.color }}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{lead.name}</h3>
        {lead.isNew && (
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            Novo
          </span>
        )}
      </div>
      
      <div className="mt-2 text-sm text-gray-600 flex items-center">
        <Phone className="h-4 w-4 text-gray-400 mr-1" />
        {lead.phone}
      </div>
      
      <div className="mt-1 text-xs text-gray-500 flex items-center">
        <Calendar className="h-3 w-3 text-gray-400 mr-1" />
        {formatDate(lead.entryDate)}
      </div>
      
      {lead.source && (
        <div className="mt-2">
          <span className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs font-semibold text-gray-700">
            {lead.source}
          </span>
        </div>
      )}
    </div>
  );
};

export default LeadCard;