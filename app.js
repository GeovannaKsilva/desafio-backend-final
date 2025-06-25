require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Importar rotas
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
});
app.use(limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (frontend)
app.use('/views', express.static(path.join(__dirname, 'views')));

// Rota para o frontend
app.get('/frontend', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Endpoint padrão da API
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do Desafio Final - Desenvolvimento Back-end II',
    version: '1.0.0',
    frontend: 'http://localhost:3000/frontend',
    endpoints: {
      clientes: '/clientes (GET, POST, PUT, DELETE) - Requer autenticação',
      produtos: '/produtos (GET, POST, PUT, DELETE) - Público',
      usuarios: '/usuarios (GET, POST, PUT, DELETE)',
      login: '/login (POST)',
      logout: '/logout (POST)'
    }
  });
});

// Rotas da API
app.use(routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo deu errado!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor'
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.originalUrl} não existe nesta API`
  });
});

// Inicializar servidor
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📖 API disponível em: http://localhost:${PORT}`);
    console.log(`🌐 Frontend disponível em: http://localhost:${PORT}/frontend`);
  });
}

module.exports = app;