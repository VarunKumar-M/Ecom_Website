const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// GET /api/products
exports.getProducts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 12 } = req.query;
  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  const skip = (Number(page) - 1) * Number(limit);
  const products = await Product.find(query).skip(skip).limit(Number(limit));
  res.json(products);
});

// GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.json(product);
  else { res.status(404); throw new Error('Product not found'); }
});

// POST /api/products (admin)
exports.createProduct = asyncHandler(async (req, res) => {
  const { title, slug, description, price, category, brand, images, countInStock } = req.body;
  const exists = await Product.findOne({ slug });
  if (exists) { res.status(400); throw new Error('Product slug must be unique'); }
  const product = await Product.create({ title, slug, description, price, category, brand, images, countInStock });
  res.status(201).json(product);
});

// PUT /api/products/:id (admin)
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// DELETE /api/products/:id (admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  await product.remove();
  res.json({ message: 'Product removed' });
});
