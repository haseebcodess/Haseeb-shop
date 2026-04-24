const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  productName: {
    type: String,
    required: [true, 'Product display name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  freeDelivery: {
    type: Boolean,
    default: false
  },
  currencyCode: {
    type: String,
    enum: ['USD', 'JPY', 'CNY', 'EUR', 'GBP'],
    default: 'USD'
  },
  image: {
    type: String,
    default: null
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  }
}, { timestamps: true });

productSchema.index({ name: 'text', shopName: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
