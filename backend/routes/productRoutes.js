const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Validation rules for product
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  body('shopName').trim().notEmpty().withMessage('Shop name is required')
    .isLength({ max: 80 }).withMessage('Shop name too long'),
  body('price').isNumeric().withMessage('Price must be a number')
    .custom((v) => v >= 0).withMessage('Price cannot be negative'),
  body('rating').isNumeric().withMessage('Rating must be a number')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('currencyCode').optional()
    .isIn(['JPY', 'CNY', 'USD', 'EUR', 'GBP', 'KRW', 'INR'])
    .withMessage('Unsupported currency code'),
];

// All routes require authentication
router.use(protect);

// Public to all authenticated users
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin only routes
router.post(
  '/',
  authorize('admin'),
  upload.single('image'),
  handleUploadError,
  productValidation,
  createProduct
);

router.put(
  '/:id',
  authorize('admin'),
  upload.single('image'),
  handleUploadError,
  updateProduct
);

router.delete('/:id', authorize('admin'), deleteProduct);

module.exports = router;
