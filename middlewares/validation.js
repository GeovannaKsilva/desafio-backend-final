// Validação de email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de string (nome, sobrenome, etc.)
const isValidString = (str, minLength = 3, maxLength = 255) => {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};

// Validação de idade
const isValidAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge > 0 && numAge < 120;
};

// Validação de preço
const isValidPrice = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice > 0;
};

// Validação de data
const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  
  const minDate = new Date('2000-01-01');
  const maxDate = new Date('2025-06-20');
  
  return date >= minDate && date <= maxDate;
};

// Middleware de validação para clientes
const validateCliente = (req, res, next) => {
  const { nome, sobrenome, email, idade } = req.body;
  const errors = [];

  // Validar nome
  if (!isValidString(nome)) {
    errors.push('Nome deve ter entre 3 e 255 caracteres');
  }

  // Validar sobrenome
  if (!isValidString(sobrenome)) {
    errors.push('Sobrenome deve ter entre 3 e 255 caracteres');
  }

  // Validar email
  if (!email || !isValidEmail(email)) {
    errors.push('Email deve ter um formato válido');
  }

  // Validar idade
  if (!isValidAge(idade)) {
    errors.push('Idade deve ser maior que 0 e menor que 120');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors
    });
  }

  next();
};

// Middleware de validação para produtos
const validateProduto = (req, res, next) => {
  const { nome, descricao, preco, data_atualizado } = req.body;
  const errors = [];

  // Validar nome
  if (!isValidString(nome)) {
    errors.push('Nome do produto deve ter entre 3 e 255 caracteres');
  }

  // Validar descrição
  if (!isValidString(descricao)) {
    errors.push('Descrição deve ter entre 3 e 255 caracteres');
  }

  // Validar preço
  if (!isValidPrice(preco)) {
    errors.push('Preço deve ser um valor positivo');
  }

  // Validar data de atualização
  if (data_atualizado && !isValidDate(data_atualizado)) {
    errors.push('Data de atualização deve estar entre 01/01/2000 e 20/06/2025');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors
    });
  }

  next();
};

// Middleware de validação para usuários
const validateUsuario = (req, res, next) => {
  const { usuario, senha } = req.body;
  const errors = [];

  // Validar nome de usuário
  if (!isValidString(usuario)) {
    errors.push('Nome de usuário deve ter entre 3 e 255 caracteres');
  }

  // Validar senha
  if (!isValidString(senha, 6)) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors
    });
  }

  next();
};

// Middleware de validação para login
const validateLogin = (req, res, next) => {
  const { usuario, senha } = req.body;
  const errors = [];

  if (!usuario || !senha) {
    errors.push('Usuário e senha são obrigatórios');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors
    });
  }

  next();
};

module.exports = {
  validateCliente,
  validateProduto,
  validateUsuario,
  validateLogin
};