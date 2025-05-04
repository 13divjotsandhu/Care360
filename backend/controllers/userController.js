const User = require('../models/User');
// Import the jsonwebtoken library to create JWT tokens
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
const { name, email, password, role = 'user'  } = req.body;      // sent by frontend

try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (no hashing)
    const user = await User.create({ name, email, password, role: role || 'user' });

    // Generate JWT
    const token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

// Payload: Include user's unique MongoDB ID 
//  Secret Key: Use the secret from environment variables
// Options: Set token to expire in 1 hour

    res.status(201).json({ token });   //send a  201 Created response back to the frontend, including the token
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
 
// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all user profiles (Admin only)
const getAllUserProfiles = async (req, res) => {
  try {
    // Only allow admin users to access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const users = await User.find().select('-password');  // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, getAllUserProfiles };


