'use strict';

const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produto.controller');
const { produtoRules } = require('../middlewares/validator');
const { cacheMiddleware, clearCache } = require('../middlewares/cache.middleware');

router.get('/', cacheMiddleware('produtos_all', 60), produtoController.getAll);

router.get('/:id', produtoRules.getById, cacheMiddleware('produto_id', 60), produtoController.getById);

router.post('/', produtoRules.create, clearCache('produtos_'), produtoController.create);

router.put('/:id', produtoRules.update, clearCache('produtos_'), produtoController.update);

router.delete('/:id', produtoRules.delete, clearCache('produtos_'), produtoController.delete);

module.exports = router;
