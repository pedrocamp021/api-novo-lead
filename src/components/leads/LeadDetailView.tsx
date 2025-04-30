import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeads } from '../../contexts/LeadContext';
import { ArrowLeft, Phone, Calendar, MapPin, ArrowDownUp, Clock, Archive } from 'lucide-react';

const LeadDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getLeadById, 
    statusConfigs, 
    updateLead, 
    archiveLead, 
    setLeadAsViewed 
  } = useLeads();
  
  const [lead, setLead] = useState(id ? getLeadById(id) : undefined);
  const [notes, setNotes] = useState(lead?.notes || '');
  
  useEffect(() => {
    if (id) {
      const leadData = getLeadById(id);
      setLead(leadData);
      setNotes(leadData?.notes || '');
      
      if (leadData?.isNew) {
        setLeadAsViewed(id);
      }
    }
  }, [id, getLeadById, setLeadAsViewed]);
  
  if (!lead) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">Lead não encontrado</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para o dashboard
        </button>
      </div>
    );
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('pt-BR', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    }).format(date);
  };
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    const updatedLead = {
      ...lead,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    };
    updateLead(updatedLead);
    setLead(updatedLead);
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };
  
  const saveNotes = () => {
    if (notes !== lead.notes) {
      const updatedLead = {
        ...lead,
        notes,
        lastUpdated: new Date().toISOString()
      };
      updateLead(updatedLead);
      setLead(updatedLead);
    }
  };
  
  const handleArchive = () => {
    if (window.confirm('Tem certeza que deseja arquivar este lead?')) {
      archiveLead(lead.id);
      navigate('/dashboard');
    }
  };
  
  const statusConfig = statusConfigs.find(config => config.name === lead.status);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="mr-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          Detalhes do Lead
        </h2>
        
        <button 
          onClick={handleArchive}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
        >
          <Archive className="h-4 w-4 mr-1" />
          Arquivar
        </button>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{lead.name}</h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-2">
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-1" />
              {lead.phone}
            </div>
            
            {lead.source && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                {lead.source}
              </div>
            )}
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
              Cadastrado em: {formatDate(lead.entryDate)}
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              Atualizado em: {formatDate(lead.lastUpdated)}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <div className="flex items-center">
            <ArrowDownUp className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={lead.status}
              onChange={handleStatusChange}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: statusConfig ? statusConfig.color : '#ccc'
              }}
            >
              {statusConfigs
                .sort((a, b) => a.order - b.order)
                .map(config => (
                  <option key={config.id} value={config.name}>
                    {config.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            id="notes"
            rows={5}
            value={notes}
            onChange={handleNotesChange}
            onBlur={saveNotes}
            className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Adicione observações sobre este lead..."
          ></textarea>
        </div>
        
        {lead.funnelStage && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-1">Etapa do Funil</h3>
            <p className="text-sm text-gray-600">{lead.funnelStage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetailView;