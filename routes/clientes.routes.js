'use strict';

const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { clienteRules } = require('../middlewares/validator');
const { cacheMiddleware, clearCache } = require('../middlewares/cache.middleware');

router.get('/', cacheMiddleware('clientes_all', 30), clienteController.getAll);

router.get('/:id', clienteRules.getById, cacheMiddleware('cliente_id', 30), clienteController.getById);

router.post('/', clienteRules.create, clearCache('clientes_'), clienteController.create);

router.put('/:id', clienteRules.update, clearCache('clientes_'), clienteController.update);

router.delete('/:id', clienteRules.delete, clearCache('clientes_'), clienteController.delete);

module.exports = router;