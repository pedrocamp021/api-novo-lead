// Resposta de sucesso
return {
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "Dados recebidos e salvos no Supabase",
    data: payload,
  }),
};

// Resposta de erro (método não permitido)
return {
  statusCode: 405,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ error: "Método não permitido" }),
};

// Resposta de erro (campo ausente)
return {
  statusCode: 400,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ error: `Campo ${field} é obrigatório` }),
};

// Resposta de erro (catch)
return {
  statusCode: 500,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    error: "Erro interno do servidor",
    details: `Erro ao salvar no Supabase: ${error.message}`,
  }),
};
