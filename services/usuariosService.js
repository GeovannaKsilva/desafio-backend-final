const { pool } = require('../configs/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuariosService {
  // Listar todos os usuários
  async listarTodos() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, usuario, created_at, updated_at FROM usuarios ORDER BY id'
      );
      
      return rows;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  async buscarPorId(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, usuario, created_at, updated_at FROM usuarios WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  // Criar novo usuário
  async criar(dadosUsuario) {
    try {
      const { usuario, senha } = dadosUsuario;
      
      // Criptografar senha
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

      const [result] = await pool.execute(
        'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)',
        [usuario, senhaHash]
      );

      return await this.buscarPorId(result.insertId);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Atualizar usuário
  async atualizar(id, dadosUsuario) {
    try {
      const { usuario, senha } = dadosUsuario;
      
      let updateQuery = 'UPDATE usuarios SET usuario = ?';
      let params = [usuario];

      // Se uma nova senha foi fornecida, incluir na atualização
      if (senha) {
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        updateQuery += ', senha = ?, token = NULL'; // Invalidar token ao trocar senha
        params.push(senhaHash);
      }

      updateQuery += ' WHERE id = ?';
      params.push(id);

      const [result] = await pool.execute(updateQuery, params);

      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }

      return await this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Deletar usuário
  async deletar(id) {
    try {
      const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Usuário não encontrado');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  // Autenticar usuário (login)
  async autenticar(usuario, senha) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, usuario, senha FROM usuarios WHERE usuario = ?',
        [usuario]
      );

      if (rows.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      const user = rows[0];

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida) {
        throw new Error('Senha inválida');
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          userId: user.id, 
          usuario: user.usuario 
        },
        process.env.JWT_SECRET,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '24h' 
        }
      );

      // Salvar token no banco
      await pool.execute(
        'UPDATE usuarios SET token = ? WHERE id = ?',
        [token, user.id]
      );

      return {
        id: user.id,
        usuario: user.usuario,
        token: token
      };
    } catch (error) {
      console.error('Erro na autenticação:', error);
      throw error;
    }
  }

  // Logout (invalidar token)
  async logout(userId) {
    try {
      await pool.execute(
        'UPDATE usuarios SET token = NULL WHERE id = ?',
        [userId]
      );
      
      return true;
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  }
}

module.exports = new UsuariosService();