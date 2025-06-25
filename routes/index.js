const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../configs/database');
const { cacheUtils } = require('../configs/cache');
const { authenticateToken } = require('../middlewares/auth');
const { validateCliente, validateProduto, validateUsuario, validateLogin } = require('../middlewares/validation');

const router = express.Router();

// ============ AUTH ROUTES ============

// POST /login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    
    const [rows] = await pool.execute(
      'SELECT id, usuario, senha FROM usuarios WHERE usuario = ?',
      [usuario]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Usuário ou senha incorretos'
      });
    }
    
    const user = rows[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);
    
    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas',
        message: 'Usuário ou senha incorretos'
      });
    }
    
    const token = jwt.sign(
      { userId: user.id, usuario: user.usuario },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    await pool.execute(
      'UPDATE usuarios SET token = ? WHERE id = ?',
      [token, user.id]
    );
    
    res.json({
      success: true,
      data: {
        id: user.id,
        usuario: user.usuario,
        token: token
      },
      message: 'Login realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE usuarios SET token = NULL WHERE id = ?',
      [req.user.id]
    );
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ============ CLIENTES ROUTES (COM CACHE E AUTH) ============

// GET /clientes
router.get('/clientes', authenticateToken, async (req, res) => {
  try {
    const cacheKey = 'clientes_all';
    const cachedData = cacheUtils.get(cacheKey);
    
    if (cachedData) {
      console.log('🎯 Dados servidos do CACHE');
      return res.json({
        success: true,
        data: cachedData,
        total: cachedData.length,
        source: 'cache'
      });
    }
    
    const [rows] = await pool.execute(
      'SELECT id, nome, sobrenome, email, idade, created_at FROM clientes ORDER BY id'
    );
    
    console.log('🗄️ Dados servidos do BANCO DE DADOS');
    cacheUtils.set(cacheKey, rows);
    
    res.json({
      success: true,
      data: rows,
      total: rows.length,
      source: 'database'
    });
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /clientes/:id
router.get('/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT id, nome, sobrenome, email, idade, created_at FROM clientes WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /clientes
router.post('/clientes', authenticateToken, validateCliente, async (req, res) => {
  try {
    const { nome, sobrenome, email, idade } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)',
      [nome, sobrenome, email, idade]
    );
    
    cacheUtils.invalidateClientsCache();
    
    const [newClient] = await pool.execute(
      'SELECT id, nome, sobrenome, email, idade, created_at FROM clientes WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: newClient[0],
      message: 'Cliente criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /clientes/:id
router.put('/clientes/:id', authenticateToken, validateCliente, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sobrenome, email, idade } = req.body;
    
    const [result] = await pool.execute(
      'UPDATE clientes SET nome = ?, sobrenome = ?, email = ?, idade = ? WHERE id = ?',
      [nome, sobrenome, email, idade, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
    
    cacheUtils.invalidateClientsCache();
    
    const [updated] = await pool.execute(
      'SELECT id, nome, sobrenome, email, idade, created_at FROM clientes WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      data: updated[0],
      message: 'Cliente atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /clientes/:id
router.delete('/clientes/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cliente não encontrado'
      });
    }
    
    cacheUtils.invalidateClientsCache();
    
    res.json({
      success: true,
      message: 'Cliente deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ============ PRODUTOS ROUTES (PÚBLICO) ============

// GET /produtos
router.get('/produtos', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, nome, descricao, preco, data_atualizado, created_at FROM produtos ORDER BY id'
    );
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /produtos/:id
router.get('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT id, nome, descricao, preco, data_atualizado, created_at FROM produtos WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /produtos
router.post('/produtos', validateProduto, async (req, res) => {
  try {
    const { nome, descricao, preco, data_atualizado } = req.body;
    const dataAtualizada = data_atualizado || new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const [result] = await pool.execute(
      'INSERT INTO produtos (nome, descricao, preco, data_atualizado) VALUES (?, ?, ?, ?)',
      [nome, descricao, preco, dataAtualizada]
    );
    
    const [newProduct] = await pool.execute(
      'SELECT id, nome, descricao, preco, data_atualizado, created_at FROM produtos WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: newProduct[0],
      message: 'Produto criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /produtos/:id
router.put('/produtos/:id', validateProduto, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, data_atualizado } = req.body;
    const dataAtualizada = data_atualizado || new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    const [result] = await pool.execute(
      'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, data_atualizado = ? WHERE id = ?',
      [nome, descricao, preco, dataAtualizada, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    const [updated] = await pool.execute(
      'SELECT id, nome, descricao, preco, data_atualizado, created_at FROM produtos WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      data: updated[0],
      message: 'Produto atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /produtos/:id
router.delete('/produtos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM produtos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Produto deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// ============ USUÁRIOS ROUTES ============

// GET /usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, usuario, created_at FROM usuarios ORDER BY id'
    );
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /usuarios
router.post('/usuarios', validateUsuario, async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    
    const senhaHash = await bcrypt.hash(senha, 10);
    
    const [result] = await pool.execute(
      'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)',
      [usuario, senhaHash]
    );
    
    const [newUser] = await pool.execute(
      'SELECT id, usuario, created_at FROM usuarios WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      data: newUser[0],
      message: 'Usuário criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Nome de usuário já existe'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;