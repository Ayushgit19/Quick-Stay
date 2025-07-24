import express from 'express'
import { checkAvailabilityAPI, createBookings, getHotelBookings, getUserBookings } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI)
bookingRouter.post('/book', protect, createBookings)
bookingRouter.get('/user', protect, getUserBookings)
bookingRouter.get('/hotel', protect, getHotelBookings)

export default bookingRouter
