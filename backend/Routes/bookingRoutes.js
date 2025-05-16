const express = require('express');

const { createBooking, getBookingDetails, getUserBookings,updateBookingStatus} = require('../controllers/bookingController');

const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/create', authMiddleware, createBooking);           //FOR TESTING : /api/bookings/create`
router.get('/my', authMiddleware, getUserBookings);                           // for specfic user
//  Users can only fetch their own booking by ID
router.get('/:id', authMiddleware, getBookingDetails);     ///api/bookings/:id

//  Admins can fetch ALL bookings without an ID
router.get('/', authMiddleware, getBookingDetails);

router.patch('/:id/status', authMiddleware, updateBookingStatus);

// GET /api/bookings/:id - Fetch a SINGLE booking by ID (User fetches own, Admin fetches any)
// IMPORTANT: Keep this route AFTER '/my' so '/my' is matched first.
router.get('/:id', authMiddleware, getBookingDetails);

module.exports = router;
