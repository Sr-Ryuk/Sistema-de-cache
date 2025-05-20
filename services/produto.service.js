'use strict';

const { pool } = require('../configs/database');


class ProdutoService {
  /**
   * Get all products
   * @param {Object} filters - Optional query filters
   * @returns {Promise<Array>} - List of products
   */
  async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM produtos';
      const queryParams = [];
      
      if (Object.keys(filters).length > 0) {
        const whereConditions = [];
        
        if (filters.nome) {
          whereConditions.push('nome LIKE ?');
          queryParams.push(`%${filters.nome}%`);
        }
        
        if (filters.preco_min) {
          whereConditions.push('preco >= ?');
          queryParams.push(filters.preco_min);
        }
        
        if (filters.preco_max) {
          whereConditions.push('preco <= ?');
          queryParams.push(filters.preco_max);
        }
        
        if (whereConditions.length > 0) {
          query += ' WHERE ' + whereConditions.join(' AND ');
        }
      }
      
      query += ' ORDER BY id DESC';
      
      const [rows] = await pool.query(query, queryParams);
      return rows;
    } catch (error) {
      console.error('Error in getAll products:', error.message);
      throw error;
    }
  }

  /**
   * Get a product by ID
   * @param {number} id - Product ID
   * @returns {Promise<Object>} - Product data
   */
  async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error in getById product ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new product
   * @param {Object} produtoData - Product data
   * @returns {Promise<Object>} - Created product
   */
  async create(produtoData) {
    try {
      const { nome, descricao, preco } = produtoData;
      
      const [result] = await pool.query(
        'INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)',
        [nome, descricao, preco]
      );
      
      return {
        id: result.insertId,
        ...produtoData,
        data_atualizado: new Date()
      };
    } catch (error) {
      console.error('Error in create product:', error.message);
      throw error;
    }
  }

  /**
   * Update a product
   * @param {number} id - Product ID
   * @param {Object} produtoData - Product data to update
   * @returns {Promise<Object>} - Update result
   */
  async update(id, produtoData) {
    try {
      const fields = Object.keys(produtoData);
      if (fields.length === 0) return { affected: 0 };
      
      const updates = fields.map(field => `${field} = ?`).join(', ');
      const values = [...Object.values(produtoData), id];
      
      const [result] = await pool.query(
        `UPDATE produtos SET ${updates} WHERE id = ?`,
        values
      );
      
      return {
        affected: result.affectedRows,
        id: parseInt(id)
      };
    } catch (error) {
      console.error(`Error in update product ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise<Object>} - Delete result
   */
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
      
      return {
        affected: result.affectedRows,
        id: parseInt(id)
      };
    } catch (error) {
      console.error(`Error in delete product ${id}:`, error.message);
      throw error;
    }
  }
}

module.exports = new ProdutoService();