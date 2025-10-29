const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find().populate('product');
    const total = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    res.json({ items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching cart' });
  }
});

// POST /api/cart  -> { productId, qty }
router.post('/', async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId required' });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // If same product exists in cart, increment qty
    let existing = await CartItem.findOne({ product: productId });
    if (existing) {
      existing.qty = existing.qty + (qty || 1);
      await existing.save();
      return res.status(200).json(existing);
    }

    const cartItem = new CartItem({ product: productId, qty: qty || 1 });
    await cartItem.save();
    await cartItem.populate('product');
    res.status(201).json(cartItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding to cart' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CartItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Removed', item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error removing cart item' });
  }
});

// PATCH /api/cart/:id -> update qty { qty }
router.patch('/:id', async (req, res) => {
  try {
    const { qty } = req.body;
    const { id } = req.params;
    if (!qty || qty < 1) return res.status(400).json({ message: 'Invalid qty' });
    const item = await CartItem.findByIdAndUpdate(id, { qty }, { new: true }).populate('product');
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating cart item' });
  }
});

module.exports = router;
