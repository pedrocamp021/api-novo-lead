import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Definir cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event) => {
  // Lidar com requisições OPTIONS (para CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Obter credenciais do Supabase a partir das variáveis de ambiente
  let supabaseUrl, supabaseKey;
  try {
    supabaseUrl = process.env.SUPABASE_URL;
    supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Credenciais do Supabase não encontradas');
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message }),
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Payload JSON inválido' }),
    };
  }

  // Validar campos obrigatórios
  const { nome, telefone, status, origem, etapa_funil } = payload;
  if (!nome || !telefone || !status || !origem || !etapa_funil) {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Campos obrigatórios ausentes: nome, telefone, status, origem e etapa_funil são necessários' }),
    };
  }

  // Inserir o lead no Supabase
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ nome, telefone, status, origem, etapa_funil }])
      .select();

    if (error) throw error;

    return {
      statusCode: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead: data[0] }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Erro ao criar lead: ' + error.message }),
    };
  }
};
