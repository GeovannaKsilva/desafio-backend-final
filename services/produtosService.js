const { pool } = require('../configs/database');

class ProdutosService {
  // Listar todos os produtos
  async listarTodos() {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nome, descricao, preco, data_atualizado, created_at, updated_at FROM produtos ORDER BY id'
      );
      
      return rows;
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      throw error;
    }
  }

  // Buscar produto por ID
  async buscarPorId(id) {
    try {
      const [rows] = await pool.execute(
        'SELECT id, nome, descricao, preco, data_atualizado, created_at, updated_at FROM produtos WHERE id = ?',
        [id]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw error;
    }
  }

  // Criar novo produto
  async criar(dadosProduto) {
    try {
      const { nome, descricao, preco, data_atualizado } = dadosProduto;
      
      // Se não informar data_atualizado, usar data atual
      const dataAtualizada = data_atualizado || new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const [result] = await pool.execute(
        'INSERT INTO produtos (nome, descricao, preco, data_atualizado) VALUES (?, ?, ?, ?)',
        [nome, descricao, preco, dataAtualizada]
      );

      return await this.buscarPorId(result.insertId);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  // Atualizar produto
  async atualizar(id, dadosProduto) {
    try {
      const { nome, descricao, preco, data_atualizado } = dadosProduto;
      
      // Se não informar data_atualizado, usar data atual
      const dataAtualizada = data_atualizado || new Date().toISOString().slice(0, 19).replace('T', ' ');

      const [result] = await pool.execute(
        'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, data_atualizado = ? WHERE id = ?',
        [nome, descricao, preco, dataAtualizada, id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Produto não encontrado');
      }

      return await this.buscarPorId(id);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  }

  // Deletar produto
  async deletar(id) {
    try {
      const [result] = await pool.execute('DELETE FROM produtos WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Produto não encontrado');
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw error;
    }
  }
}

module.exports = new ProdutosService();