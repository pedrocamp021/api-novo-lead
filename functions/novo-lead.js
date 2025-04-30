const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    console.log('Início da função novo-lead');
    console.log('Método HTTP:', event.httpMethod);

    if (event.httpMethod !== 'POST') {
      console.log('Método não permitido:', event.httpMethod);
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Método não permitido' }),
      };
    }

    const payload = JSON.parse(event.body);
    console.log('Payload recebido:', payload);

    const requiredFields = ['nome', 'telefone', 'status', 'origem', 'etapa_funil'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        console.log(`Campo ${field} ausente`);
        return {
          statusCode: 400,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: `Campo ${field} é obrigatório` }),
        };
      }
    }

    const { nome, telefone, status, origem, etapa_funil } = payload;

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    console.log('SUPABASE_URL:', supabaseUrl);
    console.log('SUPABASE_ANON_KEY:', supabaseAnonKey);

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('Variáveis de ambiente ausentes');
      throw new Error('Variáveis de ambiente SUPABASE_URL ou SUPABASE_ANON_KEY não estão definidas');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, { global: { fetch } });
    console.log('Cliente Supabase inicializado');

    console.log('Tentando inserir dados no Supabase...');
    const { data, error } = await supabase
      .from('leads')
      .insert([{ nome, telefone, status, origem, etapa_funil }]);

    if (error) {
      console.log('Erro ao inserir no Supabase:', JSON.stringify(error, null, 2));
      throw new Error(`Erro ao salvar no Supabase: ${error.message}`);
    }

    console.log('Dados inseridos com sucesso no Supabase');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Lead salvo com sucesso',
        data,
      }),
    };
  } catch (error) {
    console.log('Erro na função:', JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Erro interno do servidor',
        details: error.message,
      }),
    };
  }
};
