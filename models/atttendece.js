const mongoose = require('mongoose');

// Define the booking schema
const sessionSchema = new mongoose.Schema({
  leavetype: {
    type: String,
  },
  fromDate: {
    type: String,
  },
  toDate: {
    type: String,

  },
  session1: {
    type: String,
  },
  session2: {
    type: String,
  },
  reason:{
    type:String,
  }

});





// Create the booking model
const attendce = mongoose.model('attendence', sessionSchema);

module.exports = attendce;
