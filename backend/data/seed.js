/**
 * Simple seed script to add sample products and a demo user.
 * Usage: set MONGO_URI in .env or provide as env var, then run: node data/seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Product = require('../models/productModel');
const User = require('../models/userModel');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-local';

const products = [
  { title: 'Comfort Running Shoes', slug: 'comfort-running-shoes', description: 'Lightweight running shoes', price: 59.99, category: 'Footwear', brand: 'Stride', images: [], countInStock: 25 },
  { title: 'Noise-Cancelling Headphones', slug: 'noise-cancelling-headphones', description: 'Over-ear wireless headphones', price: 129.99, category: 'Electronics', brand: 'AcoustiX', images: [], countInStock: 15 },
  { title: 'Smart Fitness Watch', slug: 'smart-fitness-watch', description: 'Track workouts and health', price: 89.99, category: 'Wearables', brand: 'FitNow', images: [], countInStock: 30 }
];

async function seed() {
  await connectDB(MONGO_URI);
  await Product.deleteMany({});
  await User.deleteMany({});
  await Product.insertMany(products);
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  await User.create({ name: 'Demo User', email: 'demo@example.com', passwordHash, isAdmin: true });
  console.log('Seeded DB with sample products and a demo user (demo@example.com / password123)');
  mongoose.connection.close();
}
seed().catch(err => { console.error(err); process.exit(1); });
