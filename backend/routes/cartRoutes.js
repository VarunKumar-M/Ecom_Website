const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.delete('/item/:productId', protect, removeItem);

module.exports = router;
