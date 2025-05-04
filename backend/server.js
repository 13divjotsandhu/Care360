const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Import http module
const socketHandler = require('./socket');  // Import socket handler


// Import routes
const userRoutes = require('./Routes/userRoutes');
const serviceRoutes = require('./Routes/serviceRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const chatRoutes = require('./Routes/chatRoutes');

dotenv.config();
console.log(process.env.PORT);

const app = express();
const server = http.createServer(app); // Create server instance for Socket.IO

//Configure CORS 
// Define allowed origins, methods, etc.
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow Authorization header for JWT
  credentials: true, // Allow sending cookies or authorization headers
  optionsSuccessStatus: 204 // Return 204 for successful preflight requests
};

console.log("CORS configured for origin:", corsOptions.origin); // Log CORS origin
app.use(cors(corsOptions)); // Apply CORS middleware with options *before* routes

app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection function
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
      process.exit(1); // Exit process with failure
    }
  };
  
  connectDB();


// Use routes
app.use('/api/users', userRoutes); // User routes
app.use('/api/services', serviceRoutes); // Service routes
app.use('/api/bookings', bookingRoutes); // Booking routes
app.use('/api/chat', chatRoutes); // Chat routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

  
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Initialize Socket.io by passing the server instance
const io = socketHandler(server);

// Store socket.io instance globally
app.set('io', io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
