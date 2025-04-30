import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

interface WebhookPayload {
  nome: string;
  telefone: string;
  status?: string;
  origem?: string;
  etapa_funil?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const payload: WebhookPayload = await req.json();

    // Validate required fields
    if (!payload.nome || !payload.telefone) {
      return new Response(JSON.stringify({ error: 'Nome e telefone são obrigatórios.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if lead with same phone exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select()
      .eq('phone', payload.telefone)
      .single();

    const now = new Date().toISOString();

    if (existingLead) {
      // Update existing lead
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          status: payload.status || existingLead.status,
          source: payload.origem || existingLead.source,
          funnel_stage: payload.etapa_funil || existingLead.funnel_stage,
          last_updated: now
        })
        .eq('phone', payload.telefone)
        .select()
        .single();

      if (updateError) throw updateError;

      return new Response(JSON.stringify({
        success: true,
        lead: {
          nome: existingLead.name,
          telefone: existingLead.phone,
          status: updatedLead.status,
          origem: updatedLead.source,
          etapa_funil: updatedLead.funnel_stage
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create new lead
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        name: payload.nome,
        phone: payload.telefone,
        status: payload.status || 'Novo',
        source: payload.origem,
        funnel_stage: payload.etapa_funil,
        entry_date: now,
        last_updated: now,
        is_new: true,
        archived: false,
        notes: ''
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({
      success: true,
      lead: {
        nome: newLead.name,
        telefone: newLead.phone,
        status: newLead.status,
        origem: newLead.source,
        etapa_funil: newLead.funnel_stage
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});