import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, ref: "User", requiered: true},
    room: {type: String, ref: "Room", requiered: true},
    hotel: {type: String, ref: "Hotel", requiered: true},
    checkInDate: {type: Date, requiered: true},
    checkOutDate: {type: Date, requiered: true},
    totalPrice: {type: Number, requiered: true},
    guests: {type: Number, requiered: true},
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    paymentMethod: {type: String, requiered: true, default: "Pay at Hotel"},
    isPaid: {type: Boolean, requiered: false},

}, {timestamps: true})

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking
