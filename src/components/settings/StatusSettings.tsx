import React, { useState } from 'react';
import { useLeads } from '../../contexts/LeadContext';
import { StatusConfig } from '../../types';
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react';

const StatusSettings: React.FC = () => {
  const { statusConfigs, updateStatusConfig, addStatusConfig, removeStatusConfig } = useLeads();
  const [newStatus, setNewStatus] = useState({ name: '', color: '#3B82F6' });
  
  const sortedConfigs = [...statusConfigs].sort((a, b) => a.order - b.order);
  
  const handleColorChange = (id: string, color: string) => {
    const config = statusConfigs.find(c => c.id === id);
    if (config) {
      updateStatusConfig({ ...config, color });
    }
  };
  
  const handleNameChange = (id: string, name: string) => {
    const config = statusConfigs.find(c => c.id === id);
    if (config) {
      updateStatusConfig({ ...config, name });
    }
  };
  
  const handleAddStatus = () => {
    if (newStatus.name.trim() !== '') {
      const newConfig: StatusConfig = {
        id: Date.now().toString(),
        name: newStatus.name.trim(),
        color: newStatus.color,
        order: statusConfigs.length
      };
      addStatusConfig(newConfig);
      setNewStatus({ name: '', color: '#3B82F6' });
    }
  };
  
  const handleRemoveStatus = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este status? Isso pode afetar os leads existentes.')) {
      removeStatusConfig(id);
    }
  };
  
  const moveUp = (index: number) => {
    if (index > 0) {
      const current = sortedConfigs[index];
      const previous = sortedConfigs[index - 1];
      
      updateStatusConfig({ ...current, order: previous.order });
      updateStatusConfig({ ...previous, order: current.order });
    }
  };
  
  const moveDown = (index: number) => {
    if (index < sortedConfigs.length - 1) {
      const current = sortedConfigs[index];
      const next = sortedConfigs[index + 1];
      
      updateStatusConfig({ ...current, order: next.order });
      updateStatusConfig({ ...next, order: current.order });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Configurações de Status</h2>
      </div>
      
      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4">
          Configure os status disponíveis, cores e ordem de exibição no quadro kanban.
        </p>
        
        <div className="mb-6">
          <div className="flex flex-col space-y-2">
            {sortedConfigs.map((config, index) => (
              <div key={config.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                <input
                  type="color"
                  value={config.color}
                  onChange={(e) => handleColorChange(config.id, e.target.value)}
                  className="h-8 w-8 rounded cursor-pointer"
                  title="Selecionar cor"
                />
                
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => handleNameChange(config.id, e.target.value)}
                  className="flex-grow py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nome do status"
                />
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className={`p-2 rounded-md ${
                      index === 0 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Mover para cima"
                  >
                    <MoveUp className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === sortedConfigs.length - 1}
                    className={`p-2 rounded-md ${
                      index === sortedConfigs.length - 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Mover para baixo"
                  >
                    <MoveDown className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleRemoveStatus(config.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    title="Remover status"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Adicionar novo status</h3>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={newStatus.color}
              onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
              className="h-8 w-8 rounded cursor-pointer"
            />
            
            <input
              type="text"
              value={newStatus.name}
              onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
              className="flex-grow py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome do novo status"
            />
            
            <button
              onClick={handleAddStatus}
              className="inline-flex items-center py-2 px-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSettings;