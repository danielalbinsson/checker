const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const authRouter = require('./routes/auth'); // Combined auth routes
const urlRouter = require('./routes/url');
const app = express();
const port = 4000;

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://hedinapp:I9M4G44sBmPpbSDw@checkercluster.6sbkj.mongodb.net/?retryWrites=true&w=majority';

// Session Middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }, // Use true in production with HTTPS
  store: MongoStore.create({ mongoUrl: mongoURI }),
}));

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/auth', authRouter); // Register and login will be under /auth/register and /auth/login
app.use('/api', urlRouter); // URL-related actions

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
