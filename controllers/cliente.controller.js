'use strict';

const createError = require('http-errors');
const clienteService = require('../services/cliente.service');
const cache = require('../configs/cache');
const logger = require('../configs/logger');

class ClienteController {
  async getAll(req, res, next) {
    try {
      const cacheKey = 'clientes';

      const cached = cache.get(cacheKey);
      if (cached) {
        logger.logFromCache('GET /clientes - dados retornados do cache');
        return res.status(200).json({
          success: true,
          count: cached.length,
          data: cached
        });
      }

      const filters = {
        nome: req.query.nome,
        email: req.query.email,
        idade: req.query.idade ? parseInt(req.query.idade) : null
      };
      Object.keys(filters).forEach(key => {
        if (filters[key] === null || filters[key] === undefined) {
          delete filters[key];
        }
      });

      const clientes = await clienteService.getAll(filters);
      cache.set(cacheKey, clientes);
      logger.logFromDatabase('GET /clientes - dados vindos do banco');

      res.status(200).json({
        success: true,
        count: clientes.length,
        data: clientes
      });
    } catch (error) {
      logger.logError(`Erro em GET /clientes: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async getById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const cliente = await clienteService.getById(id);

      if (!cliente) return next(createError(404, `Cliente com ID ${id} não encontrado`));

      res.status(200).json({ success: true, data: cliente });
    } catch (error) {
      logger.logError(`Erro em GET /clientes/:id: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async create(req, res, next) {
    try {
      const cliente = await clienteService.create(req.body);
      cache.del('clientes'); 
      logger.logInfo('Cache invalidado após criação');

      res.status(201).json({
        success: true,
        message: 'Cliente criado com sucesso',
        data: cliente
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return next(createError(400, 'Email já está em uso'));
      }
      logger.logError(`Erro em POST /clientes: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async update(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const clienteExists = await clienteService.getById(id);
      if (!clienteExists) return next(createError(404, `Cliente com ID ${id} não encontrado`));

      const result = await clienteService.update(id, req.body);
      cache.del('clientes');
      logger.logInfo('Cache invalidado após atualização');

      res.status(200).json({
        success: true,
        message: 'Cliente atualizado com sucesso',
        data: result
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return next(createError(400, 'Email já está em uso'));
      }
      logger.logError(`Erro em PUT /clientes/:id: ${error.message}`);
      next(createError(500, error.message));
    }
  }

  async delete(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const clienteExists = await clienteService.getById(id);
      if (!clienteExists) return next(createError(404, `Cliente com ID ${id} não encontrado`));

      const result = await clienteService.delete(id);
      cache.del('clientes');
      logger.logInfo('Cache invalidado após exclusão');

      res.status(200).json({
        success: true,
        message: 'Cliente excluído com sucesso',
        data: result
      });
    } catch (error) {
      logger.logError(`Erro em DELETE /clientes/:id: ${error.message}`);
      next(createError(500, error.message));
    }
  }
}

module.exports = new ClienteController();
