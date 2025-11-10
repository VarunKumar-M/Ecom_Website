const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) { res.status(400); throw new Error('Cart is empty'); }
  const orderItems = cart.items.map(i => ({
    product: i.product._id,
    name: i.product.title,
    qty: i.qty,
    price: i.price,
    image: i.product.images && i.product.images[0]
  }));
  const itemsPrice = orderItems.reduce((s, it) => s + it.qty * it.price, 0);
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

  const order = await Order.create({
    user: req.user._id, orderItems, shippingAddress, paymentMethod,
    itemsPrice, taxPrice, shippingPrice, totalPrice
  });

  // clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json(order);
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});
