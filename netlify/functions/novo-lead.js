const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // Substituído pela SERVICE_KEY

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { nome, telefone, status, origem, etapa_funil } = JSON.parse(event.body);

    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          nome,
          telefone,
          status,
          origem,
          etapa_funil,
          entry_date: new Date(),
          last_updated: new Date(),
          is_new: true,
        },
      ])
      .select();

    if (error) throw error;

    return {
      statusCode: 201,
      body: JSON.stringify({ lead: data[0] }),
    };
  } catch (error) {
    console.error('Error inserting lead:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
