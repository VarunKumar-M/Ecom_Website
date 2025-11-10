const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

// GET /api/cart  -> get cart for current user
exports.getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = { user: req.user._id, items: [] };
  res.json(cart);
});

// POST /api/cart -> add item or replace items
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!productId) { res.status(400); throw new Error('productId required'); }
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: product._id, qty, price: product.price }] });
  } else {
    const idx = cart.items.findIndex(i => i.product.toString() === product._id.toString());
    if (idx > -1) {
      cart.items[idx].qty += qty;
      cart.items[idx].price = product.price;
    } else {
      cart.items.push({ product: product._id, qty, price: product.price });
    }
    await cart.save();
  }
  cart = await cart.populate('items.product');
  res.json(cart);
});

// DELETE /api/cart/item/:productId
exports.removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  await cart.save();
  cart = await cart.populate('items.product');
  res.json(cart);
});
