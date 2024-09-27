require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRouter = require('./routes/url');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const app = express();
const port = 4000;
const mongoURI = 'mongodb+srv://hedinapp:I9M4G44sBmPpbSDw@checkercluster.6sbkj.mongodb.net/?retryWrites=true&w=majority';//process.env.MONGODB_URI;

// Middleware
app.use(express.json()); 
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

// Ensure your connection string is defined
 // Check if this is set correctly

if (!mongoURI) {
    console.error("MongoDB URI is not defined. Please check your environment variables.");
    process.exit(1); // Exit if the URI is not set
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Routes
app.use('/user', registerRouter);
app.use('/user', loginRouter);

app.use('/api', urlRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
