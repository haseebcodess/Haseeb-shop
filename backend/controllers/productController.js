const { validationResult } = require('express-validator');
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 12, search, minPrice, maxPrice, sortBy = 'createdAt' } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(query)
      .populate('createdBy', 'name')
      .sort(sortBy === '-price' ? { price: -1 } : sortBy === 'price' ? { price: 1 } : sortBy === 'rating' ? { rating: -1 } : { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    const total = await Product.countDocuments(query);
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    const productData = {
      name: req.body.name,
      productName: req.body.productName,
      price: Number(req.body.price),
      rating: Number(req.body.rating) || 3,
      freeDelivery: req.body.freeDelivery === 'true' || req.body.freeDelivery === true,
      currencyCode: req.body.currencyCode || 'USD',
      shopName: req.body.shopName,
      createdBy: req.user.id,
      stock: Number(req.body.stock) || 100
    };
    if (req.file) {
  productData.image = req.file.path;
}
    const product = await Product.create(productData);
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    const updateData = { ...req.body };
    if (req.body.price) updateData.price = Number(req.body.price);
    if (req.body.rating) updateData.rating = Number(req.body.rating);
    if (req.body.freeDelivery !== undefined) {
      updateData.freeDelivery = req.body.freeDelivery === 'true' || req.body.freeDelivery === true;
    }
    if (req.file) {
  updateData.image = req.file.path;
}
    product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
