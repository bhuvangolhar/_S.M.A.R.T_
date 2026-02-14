require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    organizationName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    mobileNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// User Model
const User = mongoose.model('User', userSchema);

// Routes

// Signup Route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, organizationName, email, mobileNo, password } = req.body;

    // Validation
    if (!fullName || !organizationName || !email || !mobileNo || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }

    if (mobileNo.length < 10) {
      return res.status(400).json({ error: 'Please enter a valid mobile number' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const newUser = new User({
      fullName,
      organizationName,
      email,
      mobileNo,
      password,
    });

    await newUser.save();
    console.log('✅ User created:', email);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        organizationName: newUser.organizationName,
        email: newUser.email,
        mobileNo: newUser.mobileNo,
      },
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Error creating account', details: error.message });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Please fill in all fields' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Email not found. Please sign up first' });
    }

    // Verify password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    console.log('✅ User logged in:', email);

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        organizationName: user.organizationName,
        email: user.email,
        mobileNo: user.mobileNo,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Error during login', details: error.message });
  }
});

// Get user by email (for verification)
app.get('/api/users/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        organizationName: user.organizationName,
        email: user.email,
        mobileNo: user.mobileNo,
      },
    });
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
