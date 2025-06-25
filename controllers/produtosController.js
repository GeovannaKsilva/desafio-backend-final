const produtosService = require('../services/produtosService');

class ProdutosController {
  // GET /produtos
  async listarTodos(req, res) {
    try {
      const produtos = await produtosService.listarTodos();
      
      res.json({
        success: true,
        data: produtos,
        total: produtos.length,
        message: 'Produtos listados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível listar os produtos'
      });
    }
  }

  // GET /produtos/:id
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID deve ser um número válido'
        });
      }

      const produto = await produtosService.buscarPorId(parseInt(id));
      
      if (!produto) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: `Nenhum produto encontrado com o ID ${id}`
        });
      }

      res.json({
        success: true,
        data: produto,
        message: 'Produto encontrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar o produto'
      });
    }
  }

  // POST /produtos
  async criar(req, res) {
    try {
      const novoProduto = await produtosService.criar(req.body);
      
      res.status(201).json({
        success: true,
        data: novoProduto,
        message: 'Produto criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível criar o produto'
      });
    }
  }

  // PUT /produtos/:id
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID deve ser um número válido'
        });
      }

      const produtoAtualizado = await produtosService.atualizar(parseInt(id), req.body);
      
      res.json({
        success: true,
        data: produtoAtualizado,
        message: 'Produto atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      
      if (error.message === 'Produto não encontrado') {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar o produto'
      });
    }
  }

  // DELETE /produtos/:id
  async deletar(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID deve ser um número válido'
        });
      }

      await produtosService.deletar(parseInt(id));
      
      res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      
      if (error.message === 'Produto não encontrado') {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível deletar o produto'
      });
    }
  }
}

module.exports = new ProdutosController();