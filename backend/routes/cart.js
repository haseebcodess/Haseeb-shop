const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/clear', clearCart);
router.delete('/:productId', removeFromCart);
router.patch('/:productId', updateCartItem);

module.exports = router;
