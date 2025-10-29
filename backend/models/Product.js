const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String } // optional URL or base64; used on frontend if provided
});

module.exports = mongoose.model('Product', ProductSchema);
