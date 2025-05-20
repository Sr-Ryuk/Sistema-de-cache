'use strict';

const { pool } = require('../configs/database');

class ClienteService {
  /**
   * Get all clients
   * @param {Object} filters - Optional query filters
   * @returns {Promise<Array>} - List of clients
   */
  async getAll(filters = {}) {
    try {
      let query = 'SELECT * FROM clientes';
      const queryParams = [];
      
      if (Object.keys(filters).length > 0) {
        const whereConditions = [];
        
        if (filters.nome) {
          whereConditions.push('nome LIKE ?');
          queryParams.push(`%${filters.nome}%`);
        }
        
        if (filters.email) {
          whereConditions.push('email LIKE ?');
          queryParams.push(`%${filters.email}%`);
        }
        
        if (filters.idade) {
          whereConditions.push('idade = ?');
          queryParams.push(filters.idade);
        }
        
        if (whereConditions.length > 0) {
          query += ' WHERE ' + whereConditions.join(' AND ');
        }
      }
      
      query += ' ORDER BY id DESC';
      
      const [rows] = await pool.query(query, queryParams);
      return rows;
    } catch (error) {
      console.error('Error in getAll clients:', error.message);
      throw error;
    }
  }

  /**
   * Get a client by ID
   * @param {number} id - Client ID
   * @returns {Promise<Object>} - Client data
   */
  async getById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      console.error(`Error in getById client ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Create a new client
   * @param {Object} clienteData - Client data
   * @returns {Promise<Object>} - Created client
   */
  async create(clienteData) {
    try {
      const { nome, sobrenome, email, idade } = clienteData;
      
      const [result] = await pool.query(
        'INSERT INTO clientes (nome, sobrenome, email, idade) VALUES (?, ?, ?, ?)',
        [nome, sobrenome, email, idade]
      );
      
      return {
        id: result.insertId,
        ...clienteData
      };
    } catch (error) {
      console.error('Error in create client:', error.message);
      throw error;
    }
  }

  /**
   * Update a client
   * @param {number} id - Client ID
   * @param {Object} clienteData - Client data to update
   * @returns {Promise<Object>} - Update result
   */
  async update(id, clienteData) {
    try {
      const fields = Object.keys(clienteData);
      if (fields.length === 0) return { affected: 0 };
      
      const updates = fields.map(field => `${field} = ?`).join(', ');
      const values = [...Object.values(clienteData), id];
      
      const [result] = await pool.query(
        `UPDATE clientes SET ${updates} WHERE id = ?`,
        values
      );
      
      return {
        affected: result.affectedRows,
        id: parseInt(id)
      };
    } catch (error) {
      console.error(`Error in update client ${id}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete a client
   * @param {number} id - Client ID
   * @returns {Promise<Object>} - Delete result
   */
  async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
      
      return {
        affected: result.affectedRows,
        id: parseInt(id)
      };
    } catch (error) {
      console.error(`Error in delete client ${id}:`, error.message);
      throw error;
    }
  }
}

module.exports = new ClienteService();