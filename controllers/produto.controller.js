'use strict';

const createError = require('http-errors');
const produtoService = require('../services/produto.service');
const logger = require('../configs/logger');

class ProdutoController {
  async getAll(req, res, next) {
    try {
      const filters = {
        nome: req.query.nome,
        preco_min: req.query.preco_min ? parseFloat(req.query.preco_min) : null,
        preco_max: req.query.preco_max ? parseFloat(req.query.preco_max) : null
      };

      Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined) {
          delete filters[key];
        }
      });

      const produtos = await produtoService.getAll(filters);

      logger.logFromDatabase('GET /produtos - lista retornada do banco');

      res.status(200).json({
        success: true,
        count: produtos.length,
        data: produtos
      });
    } catch (error) {
      logger.logError(`Erro em GET /produtos: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const produto = await produtoService.getById(id);

      if (!produto) {
        logger.logError(`Produto com ID ${id} não encontrado`);
        return next(createError(404, `Produto com ID ${id} não encontrado`));
      }

      logger.logSuccess(`GET /produtos/${id} - produto encontrado`);

      res.status(200).json({
        success: true,
        data: produto
      });
    } catch (error) {
      logger.logError(`Erro em GET /produtos/:id: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async create(req, res, next) {
    try {
      const produto = await produtoService.create(req.body);

      logger.logSuccess('Produto criado com sucesso');

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: produto
      });
    } catch (error) {
      logger.logError(`Erro em POST /produtos: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      const id = parseInt(req.params.id);

      const produtoExists = await produtoService.getById(id);
      if (!produtoExists) {
        logger.logError(`Produto com ID ${id} não encontrado`);
        return next(createError(404, `Produto com ID ${id} não encontrado`));
      }

      const result = await produtoService.update(id, req.body);

      logger.logInfo(`Produto ${id} atualizado com sucesso`);

      res.status(200).json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: result
      });
    } catch (error) {
      logger.logError(`Erro em PUT /produtos/:id: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const id = parseInt(req.params.id);

      const produtoExists = await produtoService.getById(id);
      if (!produtoExists) {
        logger.logError(`Produto com ID ${id} não encontrado`);
        return next(createError(404, `Produto com ID ${id} não encontrado`));
      }

      const result = await produtoService.delete(id);

      logger.logInfo(`Produto ${id} excluído com sucesso`);

      res.status(200).json({
        success: true,
        message: 'Produto excluído com sucesso',
        data: result
      });
    } catch (error) {
      logger.logError(`Erro em DELETE /produtos/:id: ${error.message}`);
      next(createError(500, error.message));
    }
  }
}

module.exports = new ProdutoController();