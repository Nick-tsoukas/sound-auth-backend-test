const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending'
    },
    userId : {
        type: String,
        required: true
    }
});


const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;