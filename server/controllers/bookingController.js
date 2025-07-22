import Booking from "../models/Booking.js"
import Room from "../models/Room"


// Function to check availability of room


const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate:{$lte: checkOutDate },
            checkOutDate:{$gte: checkInDate },
        })

        const isAvailable = bookings.length === 0
        return isAvailable
    } catch (error) {
        console.error(error.message)
    }
}


// API to check availability of room
// POST /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room})
        res.json({success: true, isAvailable})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


// API to create new booking
// POST /api/bookings/book

export const createBookings = async (req, res) => {
    try {
        const {room, checkInDate, checkOutDate, guests} = req.body
        const user = req.user._id;
         
        // Before booking check availability
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room})
        if(!isAvailable){
            return res.json({success: false, message: "Room is not Available"})
        }
        
        //Get total price for room

        const roomData = await Room.findById(room).populate("hotel")
        let totalPrice = roomData.pricePerNight;

        // Calculate totalPrice based on nights

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

        totalPrice *= nights

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })

        res.json({success: true, message: "Booking created successfully"})
    } catch (error) {
        console.log(error.message)
        res.json({success: false, message: "Failed to create booking"})
    }
}

//

