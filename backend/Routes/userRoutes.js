const express = require('express');
const { registerUser, loginUser, getUserProfile ,getAllUserProfiles } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new router object specific to user routes
const router = express.Router();

// Public routes , When a POST request comes to '/api/users/register'
router.post('/register', registerUser);                                    


router.post('/login', loginUser);

// Get user profile (for logged-in user)
router.get('/profile', authMiddleware, getUserProfile);

// Get all user profiles
router.get('/allProfiles', authMiddleware, getAllUserProfiles);

module.exports = router;    