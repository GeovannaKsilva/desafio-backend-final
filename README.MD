Desafio Final - Desenvolvimento Back-end II
API RESTful para gerenciamento de clientes, produtos e usuários com autenticação JWT.

🚀 Tecnologias
Node.js
Express.js
MySQL
JWT (autenticação)
bcryptjs (criptografia de senhas)
node-cache (cache com logs)
Jest + Supertest (testes)
📁 Estrutura do Projeto
desafio-backend-final/
├── package.json
├── app.js
├── .env
├── .gitignore  
├── README.md
├── .env.example
├── configs/
│   ├── database.js
│   └── cache.js
├── controllers/
│   ├── clientesController.js
│   ├── produtosController.js
│   └── usuariosController.js
├── middlewares/
│   ├── auth.js
│   └── validation.js
├── models/
│   └── init.sql
├── routes/
│   └── index.js
├── services/
│   ├── clientesService.js
│   ├── produtosService.js
│   └── usuariosService.js
├── __tests__/
│   └── api.test.js
└── scripts/
    └── setup.js
📋 Pré-requisitos
Node.js (versão 14 ou superior)
MySQL (versão 8 ou superior)
Git
🔧 Instalação
Clone o repositório:
bash
git clone <url-do-repositorio>
cd desafio-backend-final
Instale as dependências:
bash
npm install
Configure as variáveis de ambiente:
bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais do MySQL
Configure o banco de dados automaticamente:
bash
npm run setup
Inicie o servidor:
bash
# Desenvolvimento
npm run dev

# Produção
npm start
📡 Endpoints da API
Público
GET / - Informações da API
POST /login - Autenticação
GET /produtos - Listar produtos (CRUD completo - público)
POST /produtos - Criar produto
PUT /produtos/:id - Atualizar produto
DELETE /produtos/:id - Deletar produto
Protegido (requer token JWT)
GET /clientes - Listar clientes (COM CACHE de 30s)
POST /clientes - Criar cliente (invalida cache)
PUT /clientes/:id - Atualizar cliente (invalida cache)
DELETE /clientes/:id - Deletar cliente (invalida cache)
POST /logout - Logout
Usuários
GET /usuarios - Listar usuários
POST /usuarios - Criar usuário
PUT /usuarios/:id - Atualizar usuário
DELETE /usuarios/:id - Deletar usuário
🔐 Autenticação
Para acessar endpoints protegidos, inclua o token no header:

Authorization: Bearer <seu-token-jwt>
🧪 Testes
bash
# Executar todos os testes
npm test

# Executar com watch mode
npm run test:watch
📝 Usuários padrão
Usuário: admin | Senha: password
Usuário: user1 | Senha: password
Usuário: teste | Senha: password
💾 Cache
✅ Endpoint GET /clientes usa cache de 30 segundos
✅ Cache é invalidado automaticamente ao criar/editar/deletar clientes
✅ Logs detalhados mostram se dados vieram do cache ou banco
✅ Console mostra: "🎯 Dados servidos do CACHE" ou "🗄️ Dados servidos do BANCO DE DADOS"
🌐 Exemplo de uso
bash
# 1. Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"usuario": "admin", "senha": "password"}'

# 2. Listar clientes (com token) - primeira vez vem do banco, segunda do cache
curl -X GET http://localhost:3000/clientes \
  -H "Authorization: Bearer <token>"

# 3. Criar cliente (invalida cache)
curl -X POST http://localhost:3000/clientes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"nome": "João", "sobrenome": "Silva", "email": "joao@email.com", "idade": 30}'

# 4. Logout
curl -X POST http://localhost:3000/logout \
  -H "Authorization: Bearer <token>"
✅ Funcionalidades Implementadas
✅ Arquitetura modular (configs, controllers, middlewares, models, routes, services)
✅ Autenticação JWT completa
✅ MySQL com 3 tabelas obrigatórias
✅ Cache com logs de 30 segundos no endpoint /clientes
✅ Invalidação automática do cache
✅ CRUD completo para todos os recursos
✅ Validações completas de todos os campos
✅ Testes automatizados com Jest + Supertest
✅ Senhas criptografadas com bcrypt
✅ Endpoints obrigatórios (/, /login, /logout)
✅ Separação de responsabilidades (controllers ↔ services ↔ database)
👥 Grupo
[Nome do integrante 1]
[Nome do integrante 2]
[Nome do integrante 3]
📅 Entrega
Data limite: 26 de junho de 2025, até às 23:59

