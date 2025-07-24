import express from 'express'
import { protect } from '../middlewares/authMiddleware.js';
import { registerHotel } from '../controllers/hotelController.js';

const hotelRouter = express.Router();
console.log("I am in hotel router")

hotelRouter.post('/', protect, registerHotel)

export default hotelRouter;