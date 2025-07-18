require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express'); // Include the express module
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/authRoutes');
const linksRoutes = require('./src/routes/linksRoutes');
const userRoutes = require('./src/routes/userRoutes');
const paymentRoutes=require('./src/routes/paymentRoutes');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((error) => console.log(error));

const app = express(); // Instantiate express app.

app.use((req, res, next) => {
  // Skip JSON middleware for the webhook endpoint
  if (req.originalUrl.startsWith('/payments/webhook')) {
    return next();
  }

  express.json()(req, res, next);
});

app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',
  'https://magical-mousse-326f31.netlify.app'
];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};
app.use(cors(corsOptions));
app.use('/auth', authRoutes);
app.use('/links', linksRoutes);
app.use('/users', userRoutes);

app.use('/payments',paymentRoutes);

const PORT = 5001;
app.listen(5001, (error) => {
    if (error) {
        console.log('Error starting the server: ', error);
    } else {
        console.log(`Server is running at http://localhost:${PORT}`);
    }
});