const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { 
  validateStoreCreation, 
  validateStoreUpdate 
} = require('../middleware/validation');

// Public routes (for browsing stores)
router.get('/', storesController.getAllStores);
router.get('/:id', storesController.getStoreById);

// Admin only routes
router.post('/', requireAdmin, validateStoreCreation, storesController.createStore);
router.put('/:id', requireAdmin, validateStoreUpdate, storesController.updateStore);
router.delete('/:id', requireAdmin, storesController.deleteStore);

module.exports = router; 