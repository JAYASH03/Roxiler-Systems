const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { requireStoreOwner } = require('../middleware/auth');

// Get store stats (store owner only)
router.get('/stores/:storeId/stats', requireStoreOwner, storeOwnerController.getStoreStats);
// Get store ratings (store owner only)
router.get('/stores/:storeId/ratings', requireStoreOwner, storeOwnerController.getStoreRatings);

module.exports = router; 