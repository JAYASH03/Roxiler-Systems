const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');
const { validateUserCreation, validateUserUpdate, validateStoreCreation, validateStoreUpdate } = require('../middleware/validation');

// Dashboard stats
router.get('/dashboard', requireAdmin, adminController.getDashboardStats);

// Users management
router.get('/users', requireAdmin, adminController.getAllUsers);
router.post('/users', requireAdmin, validateUserCreation, adminController.createUser);
router.put('/users/:id', requireAdmin, validateUserUpdate, adminController.updateUser);
router.delete('/users/:id', requireAdmin, adminController.deleteUser);

// Stores management
router.get('/stores', requireAdmin, adminController.getAllStores);
router.post('/stores', requireAdmin, validateStoreCreation, adminController.createStore);
router.put('/stores/:id', requireAdmin, validateStoreUpdate, adminController.updateStore);
router.delete('/stores/:id', requireAdmin, adminController.deleteStore);

module.exports = router; 