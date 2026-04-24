const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getAllProducts);
router.get('/:id', getProduct);

router.post('/', protect, adminOnly, upload.single('image'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('productName').trim().notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Valid price required'),
  body('shopName').trim().notEmpty().withMessage('Shop name is required')
], createProduct);

router.put('/:id', protect, adminOnly, upload.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
