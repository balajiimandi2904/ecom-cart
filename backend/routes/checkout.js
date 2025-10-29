const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

// POST /api/checkout
// expects: { cartItems: [{ _id, product: { _id }, qty }], name, email }
router.post('/', async (req, res) => {
  try {
    const { cartItems, name, email } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'cartItems required' });
    }

    // Calculate total strictly from DB to trust prices
    const ids = cartItems.map(ci => ci._id);
    const itemsInDb = await CartItem.find({ _id: { $in: ids } }).populate('product');
    let total = 0;
    const items = itemsInDb.map(i => {
      const sub = i.product.price * i.qty;
      total += sub;
      return { id: i._id, product: i.product, qty: i.qty, sub };
    });

    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      items,
      name: name || 'Guest',
      email: email || null
    };

    // Mock: after checkout clear those cart items
    await CartItem.deleteMany({ _id: { $in: ids } });

    res.json({ receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Checkout failed' });
  }
});

module.exports = router;
