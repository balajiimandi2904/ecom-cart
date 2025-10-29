const connectDB = require('./config/db');
const Product = require('./models/Product');

const products = [
  { name: 'Vibe Wireless Headphones', price: 49.99, image: '' },
  { name: 'Vibe Cotton T-Shirt', price: 19.99, image: '' },
  { name: 'Vibe Water Bottle', price: 12.49, image: '' },
  { name: 'Vibe Tote Bag', price: 9.99, image: '' },
  { name: 'Vibe Smart Lamp', price: 29.99, image: '' },
  { name: 'Vibe Phone Stand', price: 7.99, image: '' },
  { name: 'Vibe Notebook', price: 4.99, image: '' },
  { name: 'Vibe Sticker Pack', price: 2.99, image: '' }
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Seeded products');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
