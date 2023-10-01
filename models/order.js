const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  productId:{
    type:String,
    required:true
  }

});





// Create the booking model
const booking = mongoose.model('Booking', bookingSchema);

module.exports = booking;
