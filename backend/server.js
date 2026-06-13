const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/medicines', require('./routes/medicines'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/notifications', require('./routes/notifications'));  
app.use('/api/orders', require('./routes/orders'));

app.get('/', (req, res) => {
  res.json({ message: 'Rare Medicine Locator API is running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\nServer running on Port:${PORT}`);
  console.log(`\nWorking now..`)
});