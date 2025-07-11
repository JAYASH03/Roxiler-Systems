const { validationResult } = require('express-validator');
const pool = require('../config/database');

// Get all stores with optional filters
exports.getAllStores = async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user?.id;

    let query = `
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id LIMIT 1) as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;

    const conditions = [];
    const params = [userId || null];
    let paramCount = 1;

    if (name) {
      paramCount++;
      conditions.push(`s.name ILIKE $${paramCount}`);
      params.push(`%${name}%`);
    }

    if (address) {
      paramCount++;
      conditions.push(`s.address ILIKE $${paramCount}`);
      params.push(`%${address}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY s.id ORDER BY s.${sortBy} ${sortOrder.toUpperCase()}`;

    const result = await pool.query(query, params);

    res.json({
      stores: result.rows.map(store => ({
        ...store,
        average_rating: parseFloat(store.average_rating) || 0,
        total_ratings: parseInt(store.total_ratings) || 0,
        user_rating: store.user_rating ? parseInt(store.user_rating) : null
      }))
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get store by ID
exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await pool.query(`
      SELECT 
        s.id, s.name, s.email, s.address, s.owner_id, s.created_at, s.updated_at,
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id LIMIT 1) as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $2
      GROUP BY s.id
    `, [userId || null, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const store = result.rows[0];
    res.json({
      store: {
        ...store,
        average_rating: parseFloat(store.average_rating) || 0,
        total_ratings: parseInt(store.total_ratings) || 0,
        user_rating: store.user_rating ? parseInt(store.user_rating) : null
      }
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new store (admin only)
exports.createStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address, ownerId } = req.body;

    // Check if owner exists and is a store owner
    const ownerResult = await pool.query(
      'SELECT id, role FROM users WHERE id = $1',
      [ownerId]
    );

    if (ownerResult.rows.length === 0) {
      return res.status(400).json({ error: 'Owner not found' });
    }

    if (ownerResult.rows[0].role !== 'store_owner') {
      return res.status(400).json({ error: 'Owner must be a store owner' });
    }

    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, ownerId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update store (admin only)
exports.updateStore = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;

    const result = await pool.query(
      'UPDATE stores SET name = $1, email = $2, address = $3, owner_id = $4 WHERE id = $5 RETURNING *',
      [name, email, address, ownerId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({
      message: 'Store updated successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete store (admin only)
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM stores WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Delete store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 