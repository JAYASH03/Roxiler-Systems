const express = require('express');
const router = express.Router();
const ratingsController = require('../controllers/ratingsController');
const { authenticate } = require('../middleware/auth');
const { validateRatingSubmission, validateRatingUpdate } = require('../middleware/validation');

// Submit or update a rating (authenticated)
router.post('/', authenticate, validateRatingSubmission, ratingsController.submitRating);
router.put('/:id', authenticate, validateRatingUpdate, ratingsController.updateRating);
router.delete('/:id', authenticate, ratingsController.deleteRating);

// Get ratings for a store (public)
router.get('/store/:storeId', ratingsController.getStoreRatings);
// Get user's rating for a store (authenticated)
router.get('/user/:storeId', authenticate, ratingsController.getUserRating);

module.exports = router; 