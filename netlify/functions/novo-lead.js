const { createClient } = require('@supabase/supabase-js');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

exports.handler = async (event, context) => {
  // Lidar com requisições CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Permitir apenas requisições POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // Obter credenciais do Supabase a partir das variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      throw new Error('Credenciais do Supabase não encontradas');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let payload;
    try {
      payload = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Payload JSON inválido' })
      };
    }

    // Validar campos obrigatórios
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Nome e telefone são obrigatórios' })
      };
    }

    // Verificar se já existe um lead com o mesmo telefone
    const { data: existingLead, error: selectError } = await supabase
      .from('leads')
      .select()
      .eq('telefone', payload.telefone)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    const now = new Date().toISOString();

    if (existingLead) {
      // Atualizar lead existente
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          nome: payload.nome,
          status: payload.status || existingLead.status,
          origem: payload.origem || existingLead.origem,
          etapa_funil: payload.etapa_funil || existingLead.etapa_funil,
          last_updated: now
        })
        .eq('telefone', payload.telefone)
        .select()
        .single();

      if (updateError) throw updateError;

      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Lead atualizado com sucesso',
          lead: updatedLead
        })
      };
    }

    // Criar novo lead
    const { data: newLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        nome: payload.nome,
        telefone: payload.telefone,
        status: payload.status || 'Novo',
        origem: payload.origem,
        etapa_funil: payload.etapa_funil,
        entry_date: now,
        last_updated: now,
        is_new: true,
        qualificacao: null,
        notes: ''
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return {
      statusCode: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Lead criado com sucesso',
        lead: newLead
      })
    };

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Erro interno do servidor',
        details: error.message
      })
    };
  }
};
