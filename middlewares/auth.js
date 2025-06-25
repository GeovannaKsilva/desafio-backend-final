const jwt = require('jsonwebtoken');
const { pool } = require('../configs/database');

// Middleware de autenticação JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso requerido',
        message: 'Por favor, forneça um token válido no header Authorization'
      });
    }

    // Verificar se o token é válido
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar se o token ainda existe no banco 
    const [rows] = await pool.execute(
      'SELECT id, usuario, token FROM usuarios WHERE id = ? AND token = ?',
      [decodedToken.userId, token]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
        message: 'O token fornecido não é válido ou foi invalidado'
      });
    }

    // Adicionar dados do usuário na requisição
    req.user = {
      id: rows[0].id,
      usuario: rows[0].usuario,
      token: token
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token malformado',
        message: 'O token fornecido não possui um formato válido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado',
        message: 'O token fornecido expirou. Faça login novamente'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Erro ao verificar autenticação'
    });
  }
};

module.exports = {
  authenticateToken
};