const { pool } = require('../configs/database');
const { cacheUtils } = require('../configs/cache');

class ClientesService {
  // Listar todos os clientes COM CACHE
  async listarTodos() {
    try {
      const cacheKey = 'clientes_all';
      const cachedData = cacheUtils.get(cacheKey);
      
      if (cachedData) {
        console.log('🎯 Dados servidos do CACHE');
        return {
          data: cachedData,
          source: 'cache'
        };
      }

      // Se não houver cache, buscar no banco
      const [rows] = await pool.execute(
        'SELECT id, nome, sobrenome, email, idade, created_at, updated_at FROM clientes ORDER BY id'
      );
      
      console.log('🗄️ Dados servidos do BANCO DE DADOS');
      
      // Armazenar no cache
      cacheUtils.set(cacheKey, rows);
      
      return {
        data: rows,
        source: 'database'
      };
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  async buscarPorId(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nome, sobrenome, email, idade, created_at, updated_at FROM clientes WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  // Criar novo cliente
  async criar(dadosCliente) {
    try {
      const { nome, sobrenome, email, idade } = dadosCliente;
      
      const [result] = await pool.execute(
        'INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)',
        [nome, sobrenome, email, idade]
      );

      // Invalidar cache após criar
      cacheUtils.invalidateClientsCache();
      
      return await this.buscarPorId(result.insertId);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  // Atualizar cliente
  async atualizar(id, dadosCliente) {
    try {
      const { nome, sobrenome, email, idade } = dadosCliente;
      
      const [result] = await pool.execute(
        'UPDATE clientes SET nome = ?, sobrenome = ?, email = ?, idade = ? WHERE id = ?',
        [nome, sobrenome, email, idade, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Cliente não encontrado');
      }

      // Invalidar cache após atualizar
      cacheUtils.invalidateClientsCache();
      
      return await this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  // Deletar cliente
  async deletar(id) {
    try {
      const [result] = await pool.execute('DELETE FROM clientes WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Cliente não encontrado');
      }
      
      // Invalidar cache após deletar
      cacheUtils.invalidateClientsCache();
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }
}

module.exports = new ClientesService();