Desafio Final - Backend II
API para gerenciar clientes, produtos e usuários. Feita para o trabalho final da disciplina.

Como rodar
Precisa ter Node.js e MySQL instalados.

bash
git clone https://github.com/GeovannaKsilva/desafio-backend-final.git
cd desafio-backend-final
npm install
Configurar o banco:

Abrir o XAMPP e ligar o MySQL
Executar o arquivo models/init.sql no phpMyAdmin
Copiar .env.example para .env e ajustar as configurações
bash
npm run dev
A API fica em http://localhost:3000 e tem uma interface em http://localhost:3000/frontend

Endpoints
Público:

GET / - Info da API
GET /produtos - Lista produtos
POST /login - Fazer login
Precisa estar logado:

GET /clientes - Lista clientes (tem cache de 30s)
POST /clientes - Criar cliente
PUT /clientes/:id - Editar cliente
DELETE /clientes/:id - Deletar cliente
POST /logout - Sair
Usuários:

GET /usuarios - Lista usuários
POST /usuarios - Criar usuário
Login
Usuários para teste:

admin / password
user1 / password
teste / password
Tecnologias usadas
Node.js + Express
MySQL (com XAMPP)
JWT para autenticação
Cache com logs
Testes com Jest
O que implementamos
Autenticação com JWT
Cache nos clientes (mostra logs se veio do cache ou banco)
CRUD completo para tudo
Testes automatizados
Interface web para demonstrar
Validações nos dados
Senhas criptografadas
Estrutura
configs/     - configurações do banco e cache
controllers/ - lógica dos endpoints
middlewares/ - autenticação e validações
models/      - script SQL
routes/      - definição das rotas
services/    - acesso ao banco
views/       - interface web
__tests__/   - testes automatizados
Testes
bash
npm test
Grupo
Geovanna Karin
Rodrigo Melo
