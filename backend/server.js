const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
const checkoutRoute = require('./routes/checkout');

const app = express();

// basic middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// connect DB
connectDB();

// routes
app.use('/api/products', productsRoute);
app.use('/api/cart', cartRoute);
app.use('/api/checkout', checkoutRoute);

// root
app.get('/', (req, res) => res.json({ message: 'Mock E-Com API running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
