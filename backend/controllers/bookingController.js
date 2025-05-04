const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');

// Create a new booking
const createBooking = async (req, res) => {
  const { serviceId, date  } = req.body;
  const userId = req.user.id;   //get user id from middleware

  try {
    // Check if user and service exist
    const user = await User.findById(userId);
    const service = await Service.findById(serviceId);

    if (!user || !service) {
      return res.status(404).json({ message: 'User or service not found' });
    }

    // Create booking
    const booking = await Booking.create({ user: userId, service: serviceId,date });

    res.status(201).json(booking);
  } catch (error) {
   
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bookings for the logged-in user
const getUserBookings = async (req, res) => {
  try {
    // Get the authenticated user's ID from the authMiddleware
    const userId = req.user.id;

    // Find all bookings where the 'user' field matches the logged-in user's ID
    const bookings = await Booking.find({ user: userId })
      .populate('service', 'name description price') 
      .sort({ date: -1 }); // Sort by date descending (most recent first)
    // Return the found bookings (even if it's an empty array)
    res.status(200).json(bookings);

  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: 'Server error while fetching your bookings' });
  }
};

// Get booking details
const getBookingDetails = async (req, res) => {
    try {
    let bookings;
    const userId = req.user.id; // Get user ID from authMiddleware
    const userRole = req.user.role; // Get user role

    // Check if an ID parameter is provided in the URL
    const { id } = req.params;

    if (!userId) {
      console.error("Error in getBookingDetails: req.user.id is missing. Check authMiddleware.");
      return res.status(401).json({ message: 'Authentication error.' });
   }
/*
  // --- V V V --- NOW ADD LOGGING --- V V V ---
  console.log("--- Debug getBookingDetails ---");
  console.log("Request Params ID:", id); // Log the ID from params
  console.log("Authenticated User Object:", req.user); // Log the whole user object
  console.log(`Authenticated User ID: ${userId}`); // Log the extracted ID
  console.log(`Authenticated User Role: ${userRole}`); // Log the extracted Role
  // --- ^ ^ ^ --- END LOGGING --- ^ ^ ^ ---
  */

    if (userRole === 'admin' && !id) {
      //fetching ALL bookings (GET /api/bookings/) 
      console.log("Admin fetching all bookings...");
      bookings = await Booking.find()
        .populate('user', 'name email') // Populate user details for admin view
        .populate('service', 'name description price') // Populate service details
        .sort({ date: -1 }); // Sort by date descending
        console.log(`Admin found ${bookings?.length ?? 0} bookings.`);


    } else if (id) {
      // --- Fetching a SINGLE booking by ID (GET /api/bookings/:id) ---
      console.log(`Fetching booking by ID: ${id}`);
      bookings = await Booking.findById(id)
        .populate('user', 'name email')
        .populate('service', 'name description price');

      if (!bookings) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      //Authorization Check for single booking
      // Allow if user is admin OR if the booking belongs to the user
      if (userRole !== 'admin' && bookings.user._id.toString() !== userId) {
        return res.status(403).json({ message: 'Access denied, not your booking' });
      }
    } else {
        // Regular user trying to access GET /api/bookings/ without ID
         return res.status(403).json({ message: 'Access denied. Use /api/bookings/my to get your bookings.' });
    }
    res.status(200).json(bookings);

  } catch (error) {
    console.error("Error in getBookingDetails:", error);
    res.status(500).json({ message: 'Server error while fetching booking details', error: error.message });
  }
};

module.exports = {   createBooking,   getUserBookings,  getBookingDetails, };

