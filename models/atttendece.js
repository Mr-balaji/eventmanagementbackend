const mongoose = require('mongoose');

// Define the booking schema
const sessionSchema = new mongoose.Schema({
  leavetype: {
    type: Object,
  },
  fromDate: {
    type: Object,
  },
  toDate: {
    type: Object,

  },
  session1: {
    type: Object,
  },
  session2: {
    type: Object,
  },
  reason:{
    type:String,
  }

});





// Create the booking model
const attendce = mongoose.model('attendence', sessionSchema);

module.exports = attendce;
