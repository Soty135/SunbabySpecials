// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://sotontestanley:14229337Sss@foodorderingsite.y780d.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample route
app.get('/api/products', (req, res) => {
  // Replace this with your actual logic to fetch products from the database
  res.json([
    { id: 1, name: 'Jollof Rice', price: 29.99 },
    { id: 2, name: 'Egusi Soup', price: 34.99 },
    // ...other products
  ]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
