const express = require("express");
const bookingRoute = express.Router();
const logger = require('../utility/logger');
const cors = require('cors');
bookingRoute.use(cors());
const booking = require("../models/order");


// Create a user
bookingRoute.route("/").post(async (req, res) => {
    try {
      const { firstName,lastName,email,phoneNumber,address,productId } = req.body;

      const useExist = await booking.findOne({email});
      if(firstName === null || lastName === "" || email === "" || phoneNumber ==="" || address === ""   ){
        res.json({
          responseCode: 500,
          responseStatus: "error",
          responseMsg: "All fields Are Required",
          // responseData: ,
        });
      }
      else{
      const responseData = new booking({firstName,lastName,email,phoneNumber,address,productId});
     console.log(responseData);

     responseData.save()

      res.json({
        responseCode: 200,
        responseStatus: "success",
        responseMsg: "Booking  SuccessFully",
        responseData: responseData,
      });
      }
    } catch (error) {
      logger.error("Error in route create user", error);
      res.status(500).json({
        responseCode: 500,
        responseStatus: "error",
        responseMsg: "Something went wrong!..",
      });
    }
  });

  module.exports = bookingRoute;