const pool = require('../config/database');

// Get store statistics for store owner
exports.getStoreStats = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    // Verify store ownership
    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE id = $1 AND owner_id = $2',
      [storeId, userId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found or access denied' });
    }

    // Get store statistics
    const statsResult = await pool.query(`
      SELECT 
        COALESCE(AVG(r.rating), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        COUNT(DISTINCT r.user_id) as unique_raters
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE s.id = $1
      GROUP BY s.id
    `, [storeId]);

    const stats = statsResult.rows[0] || {
      average_rating: 0,
      total_ratings: 0,
      unique_raters: 0
    };

    res.json({
      storeId: parseInt(storeId),
      averageRating: parseFloat(stats.average_rating) || 0,
      totalRatings: parseInt(stats.total_ratings) || 0,
      uniqueRaters: parseInt(stats.unique_raters) || 0
    });
  } catch (error) {
    console.error('Get store stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get store ratings for store owner
exports.getStoreRatings = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    // Verify store ownership
    const storeResult = await pool.query(
      'SELECT id FROM stores WHERE id = $1 AND owner_id = $2',
      [storeId, userId]
    );

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found or access denied' });
    }

    // Get ratings with user information
    const ratingsResult = await pool.query(`
      SELECT 
        r.id, r.rating, r.created_at, r.updated_at,
        u.id as user_id, u.name as user_name, u.email as user_email
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.created_at DESC
    `, [storeId]);

    res.json({
      ratings: ratingsResult.rows
    });
  } catch (error) {
    console.error('Get store ratings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 