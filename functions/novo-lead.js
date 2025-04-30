const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const payload = JSON.parse(event.body);
  const { nome, telefone, status, origem, etapa_funil } = payload;

  const supabase = createClient(
    'https://baberofownzkkqqjlonl.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhYmVyb2Zvd256a2txcWpsb25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5Nzc5NTcsImV4cCI6MjA2MTU1Mzk1N30.W6IbBaC5ASw5i9CC4edEtaxPPTi3I37MuBos_wzpekg'
  );

  const { data, error } = await supabase
    .from('leads')
    .insert([{ nome, telefone, status, origem, etapa_funil }]);

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Lead salvo com sucesso', data }),
  };
};
