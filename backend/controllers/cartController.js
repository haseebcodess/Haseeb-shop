const User = require('../models/User');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    res.status(200).json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const user = await User.findById(req.user.id);
    const existingItem = user.cart.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('cart.product');
    res.status(200).json({ success: true, message: 'Added to cart', cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.product.toString() !== req.params.productId);
    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('cart.product');
    res.status(200).json({ success: true, message: 'Removed from cart', cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);
    const item = user.cart.find(item => item.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });
    if (quantity <= 0) {
      user.cart = user.cart.filter(i => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }
    await user.save();
    const updatedUser = await User.findById(req.user.id).populate('cart.product');
    res.status(200).json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { cart: [] });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
