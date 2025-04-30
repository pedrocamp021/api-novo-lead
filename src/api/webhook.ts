import { Lead } from '../types';
import { getStoredLeads, saveLeads } from '../utils/localStorage';

interface WebhookPayload {
  nome: string;
  telefone: string;
  status?: string;
  origem?: string;
  etapa_funil?: string;
  [key: string]: any;
}

export const handleWebhookRequest = async (request: Request): Promise<Response> => {
  // Check if it's a POST request
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  // Handle OPTIONS request for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  try {
    // Parse the request body
    const payload: WebhookPayload = await request.json();
    
    // Validate required fields
    if (!payload.nome || !payload.telefone) {
      return new Response(JSON.stringify({ error: 'Nome e telefone são obrigatórios' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Get current leads
    const currentLeads = getStoredLeads();
    const now = new Date().toISOString();
    
    // Check if lead with same phone exists
    const existingLeadIndex = currentLeads.findIndex(lead => lead.phone === payload.telefone);
    
    if (existingLeadIndex !== -1) {
      // Update existing lead
      const existingLead = currentLeads[existingLeadIndex];
      const updatedLead: Lead = {
        ...existingLead,
        status: payload.status || existingLead.status,
        source: payload.origem || existingLead.source,
        funnelStage: payload.etapa_funil || existingLead.funnelStage,
        lastUpdated: now
      };
      
      currentLeads[existingLeadIndex] = updatedLead;
      saveLeads(currentLeads);
      
      return new Response(JSON.stringify({
        success: true,
        lead: {
          nome: updatedLead.name,
          telefone: updatedLead.phone,
          status: updatedLead.status,
          origem: updatedLead.source,
          etapa_funil: updatedLead.funnelStage
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Create new lead
    const newLead: Lead = {
      id: Date.now().toString(),
      name: payload.nome,
      phone: payload.telefone,
      status: payload.status || 'Novo',
      source: payload.origem,
      funnelStage: payload.etapa_funil,
      entryDate: now,
      lastUpdated: now,
      notes: '',
      isNew: true,
      archived: false
    };
    
    currentLeads.push(newLead);
    saveLeads(currentLeads);
    
    return new Response(JSON.stringify({
      success: true,
      lead: {
        nome: newLead.name,
        telefone: newLead.phone,
        status: newLead.status,
        origem: newLead.source,
        etapa_funil: newLead.funnelStage
      }
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};