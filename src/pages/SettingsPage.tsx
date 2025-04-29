import React from 'react';
import Navbar from '../components/dashboard/Navbar';
import StatusSettings from '../components/settings/StatusSettings';
import { ArrowLeft, Webhook } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const webhookUrl = `${window.location.origin}/api/novo-lead`;
  
  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
      .then(() => {
        alert('URL do webhook copiada para a área de transferência!');
      })
      .catch(() => {
        alert('Não foi possível copiar. Por favor, copie manualmente.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      
      <div className="flex-grow p-4 sm:p-6 max-w-7xl w-full mx-auto">
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para o Dashboard
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h1>
        
        <div className="space-y-8">
          <StatusSettings />
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Webhook className="h-5 w-5 mr-2 text-blue-600" />
                Configuração do Webhook
              </h2>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Use este endpoint para receber leads automaticamente de ferramentas como N8N.
                Envie um POST com os dados do lead para este URL:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex">
                  <input
                    type="text"
                    value={webhookUrl}
                    readOnly
                    className="flex-grow py-2 px-3 border border-gray-300 bg-gray-50 rounded-l-md"
                  />
                  <button
                    onClick={copyWebhookUrl}
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                  >
                    Copiar
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Formato esperado (JSON):</h3>
                <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto text-xs">
{`{
  "nome": "Nome do Lead",
  "telefone": "(11) 99999-9999",
  "status": "Interessado",
  "origem": "Site",
  "etapa_funil": "Avaliação inicial"
}`}
                </pre>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p>Os campos <strong>nome</strong> e <strong>telefone</strong> são obrigatórios. Os demais são opcionais.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;