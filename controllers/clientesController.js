const clientesService = require('../services/clientesService');

class ClientesController {
  // GET /clientes
  async listarTodos(req, res) {
    try {
      const clientes = await clientesService.listarTodos();
      
      res.json({
        success: true,
        data: clientes.data,
        total: clientes.data.length,
        source: clientes.source,
        message: 'Clientes listados com sucesso'
      });
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível listar os clientes'
      });
    }
  }

  // GET /clientes/:id
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

      const cliente = await clientesService.buscarPorId(parseInt(id));
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          message: `Nenhum cliente encontrado com o ID ${id}`
        });
      }

      res.json({
        success: true,
        data: cliente,
        message: 'Cliente encontrado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar o cliente'
      });
    }
  }

  // POST /clientes
  async criar(req, res) {
    try {
      const novoCliente = await clientesService.criar(req.body);
      
      res.status(201).json({
        success: true,
        data: novoCliente,
        message: 'Cliente criado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      
      if (error.message.includes('já cadastrado') || error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          error: 'Conflito de dados',
          message: 'Email já cadastrado'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível criar o cliente'
      });
    }
  }

  // PUT /clientes/:id
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

      const clienteAtualizado = await clientesService.atualizar(parseInt(id), req.body);
      
      res.json({
        success: true,
        data: clienteAtualizado,
        message: 'Cliente atualizado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          message: error.message
        });
      }
      
      if (error.message.includes('já cadastrado') || error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          error: 'Conflito de dados',
          message: 'Email já cadastrado para outro cliente'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar o cliente'
      });
    }
  }

  // DELETE /clientes/:id
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

      await clientesService.deletar(parseInt(id));
      
      res.json({
        success: true,
        message: 'Cliente deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível deletar o cliente'
      });
    }
  }
}

module.exports = new ClientesController();