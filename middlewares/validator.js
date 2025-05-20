'use strict';

const { validationResult, body, param } = require('express-validator');
const createError = require('http-errors');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(createError(400, { errors: errors.array() }));
  }
  next();
};

const clienteRules = {
  create: [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('sobrenome').notEmpty().withMessage('Sobrenome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('idade').optional().isInt({ min: 0 }).withMessage('Idade deve ser um número positivo'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('sobrenome').optional().notEmpty().withMessage('Sobrenome não pode ser vazio'),
    body('email').optional().isEmail().withMessage('Email inválido'),
    body('idade').optional().isInt({ min: 0 }).withMessage('Idade deve ser um número positivo'),
    validate
  ],
  getById: [
    param('id').isInt().withMessage('ID inválido'),
    validate
  ],
  delete: [
    param('id').isInt().withMessage('ID inválido'),
    validate
  ]
};

const produtoRules = {
  create: [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('descricao').optional(),
    body('preco').isFloat({ min: 0 }).withMessage('Preço deve ser um valor positivo'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('ID inválido'),
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('descricao').optional(),
    body('preco').optional().isFloat({ min: 0 }).withMessage('Preço deve ser um valor positivo'),
    validate
  ],
  getById: [
    param('id').isInt().withMessage('ID inválido'),
    validate
  ],
  delete: [
    param('id').isInt().withMessage('ID inválido'),
    validate
  ]
};

module.exports = {
  clienteRules,
  produtoRules
};