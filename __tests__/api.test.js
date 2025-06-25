const request = require('supertest');
const app = require('../app');

let authToken = '';

describe('API Tests', () => { 
  
  
  describe('POST /login', () => {
    test('Deve fazer login com credenciais válidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          usuario: 'admin',
          senha: 'password'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      
     
      authToken = response.body.data.token;
    });
    
    test('Deve rejeitar credenciais inválidas', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          usuario: 'admin',
          senha: 'senha_errada'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
    
    test('Deve validar campos obrigatórios', async () => {
      const response = await request(app)
        .post('/login')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
   
  
  describe('GET /usuarios', () => {
    test('Deve listar usuários', async () => {
      const response = await request(app).get('/usuarios');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('POST /usuarios', () => {
    test('Deve criar usuário com dados válidos', async () => {
      const novoUsuario = {
        usuario: 'teste_usuario_' + Date.now(),
        senha: 'senha123'
      };
      
      const response = await request(app)
        .post('/usuarios')
        .send(novoUsuario);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.usuario).toBe(novoUsuario.usuario);
    });
    
    test('Deve rejeitar usuário com nome muito curto', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send({
          usuario: 'ab',
          senha: 'senha123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('Deve rejeitar usuário com senha muito curta', async () => {
      const response = await request(app)
        .post('/usuarios')
        .send({
          usuario: 'usuario_teste',
          senha: '123'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  
  
  describe('GET /produtos', () => {
    test('Deve listar produtos sem autenticação', async () => {
      const response = await request(app).get('/produtos');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('POST /produtos', () => {
    test('Deve criar produto com dados válidos', async () => {
      const novoProduto = {
        nome: 'Produto Teste',
        descricao: 'Descrição do produto teste',
        preco: 99.99,
        data_atualizado: '2024-01-15 10:30:00'
      };
      
      const response = await request(app)
        .post('/produtos')
        .send(novoProduto);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(novoProduto.nome);
    });
    
    test('Deve rejeitar produto com nome muito curto', async () => {
      const response = await request(app)
        .post('/produtos')
        .send({
          nome: 'Ab',
          descricao: 'Descrição válida',
          preco: 99.99
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('Deve rejeitar produto com preço negativo', async () => {
      const response = await request(app)
        .post('/produtos')
        .send({
          nome: 'Produto Teste',
          descricao: 'Descrição válida',
          preco: -10
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('Deve rejeitar produto com data inválida', async () => {
      const response = await request(app)
        .post('/produtos')
        .send({
          nome: 'Produto Teste',
          descricao: 'Descrição válida',
          preco: 99.99,
          data_atualizado: '1999-01-01 10:30:00'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  
  
  describe('GET /clientes', () => {
    test('Deve rejeitar acesso sem token', async () => {
      const response = await request(app).get('/clientes');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
    
    test('Deve listar clientes com token válido', async () => {
      const response = await request(app)
        .get('/clientes')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('POST /clientes', () => {
    test('Deve criar cliente com dados válidos', async () => {
      const novoCliente = {
        nome: 'Cliente Teste',
        sobrenome: 'Sobrenome Teste',
        email: 'teste' + Date.now() + '@email.com',
        idade: 30
      };
      
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(novoCliente);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe(novoCliente.nome);
    });
    
    test('Deve rejeitar cliente com email inválido', async () => {
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Cliente Teste',
          sobrenome: 'Sobrenome Teste',
          email: 'email_invalido',
          idade: 30
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('Deve rejeitar cliente com idade inválida', async () => {
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Cliente Teste',
          sobrenome: 'Sobrenome Teste',
          email: 'teste@email.com',
          idade: 150
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    test('Deve rejeitar cliente com nome muito curto', async () => {
      const response = await request(app)
        .post('/clientes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nome: 'Ab',
          sobrenome: 'Sobrenome Teste',
          email: 'teste@email.com',
          idade: 30
        });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  
  
  describe('POST /logout', () => {
    test('Deve fazer logout com token válido', async () => {
      const response = await request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    test('Deve rejeitar logout sem token', async () => {
      const response = await request(app).post('/logout');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  
  
  describe('GET /', () => {
    test('Deve retornar informações da API', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Bem-vindo');
    });
  });
});