const { validationResult } = require('express-validator');
const pool = require('../config/database');

// Submit a rating for a store
exports.submitRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { storeId, rating } = req.body;
    const userId = req.user.id;

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if store exists
    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE id = $1',
      [storeId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if user already rated this store
    const existingRating = await pool.query(
      'SELECT id, rating FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );

    if (existingRating.rows.length > 0) {
      // Update existing rating
      const result = await pool.query(
        'UPDATE ratings SET rating = $1 WHERE user_id = $2 AND store_id = $3 RETURNING *',
        [rating, userId, storeId]
      );

      res.json({
        message: 'Rating updated successfully',
        rating: result.rows[0]
      });
    } else {
      // Create new rating
      const result = await pool.query(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
        [userId, storeId, rating]
      );

      res.status(201).json({
        message: 'Rating submitted successfully',
        rating: result.rows[0]
      });
    }
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a rating
exports.updateRating = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if rating exists and belongs to user
    const existingRating = await pool.query(
      'SELECT id FROM ratings WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingRating.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found or access denied' });
    }

    const result = await pool.query(
      'UPDATE ratings SET rating = $1 WHERE id = $2 RETURNING *',
      [rating, id]
    );

    res.json({
      message: 'Rating updated successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM ratings WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found or access denied' });
    }

    res.json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get ratings for a specific store
exports.getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;

    const result = await pool.query(`
      SELECT 
        r.id, r.rating, r.created_at, r.updated_at,
        u.id as user_id, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `, [storeId]);

    res.json({
      ratings: result.rows
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's rating for a specific store
exports.getUserRating = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, rating, created_at, updated_at FROM ratings WHERE user_id = $1 AND store_id = $2',
      [userId, storeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    res.json({
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 