const express = require("express");
const userRoute = express.Router();
const User = require("../models/user");
const logger = require('../utility/logger');
const cors = require('cors');
const jwt = require('jsonwebtoken');
userRoute.use(cors());
const multer = require('multer');




// Create a user
userRoute.route("/").post(async (req, res) => {
  try {
    const { firstName,lastName,email,password } = req.body;

    const useExist = await User.findOne({email});
    if(useExist !== null){
      res.json({
        responseCode: 500,
        responseStatus: "error",
        responseMsg: "Duplicate Emails",
        // responseData: ,
      });
    }
    else{
    const responseData = new User({firstName,lastName,email,password});
   console.log(responseData);

   responseData.save()

    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "User Created SuccessFully",
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

//Login Code
userRoute.route("/login").post(async (req, res) => {
  try {
    const { email,password } = req.body;

    // console.log("hello",req.body);
    const useExist = await User.findOne({email});

    // console.log(useExist);


    if (!useExist) {
      // If user not found, return an error
      return res.json({
        responseCode: 401,
        responseStatus: "error",
        responseMsg: "Invalid credentials  ",
        // responseData: ,
      });
    }
    const isMatch = await useExist.comparePassword(password);

      if (!isMatch) {
      // If passwords don't match, return an error
      return res.json({
        responseCode: 500,
        responseStatus: "error",
        responseMsg: "Invalid credentials ",
        // responseData: ,
      });
    }
    else{
       // If the user's credentials are correct, generate a JWT token
       const payload = {
        user: {
          id: useExist._id, // You can include any user data you want in the token
          email: useExist.email,
        },
      };

      const newToken = jwt.sign(payload, "JWT_SECRET", { expiresIn: '1h' });

    // Update the user's record with the new token value
    useExist.token = newToken;
   await User.updateOne({ _id: useExist._id }, { $set: { token: newToken } })
  .then(result => {
    console.log(`Updated ${result.nModified} user`);
  })
  .catch(error => {
    console.error(error);
  });
        // res.json({ newToken });

      return res.json({
        responseCode: 200,
        responseStatus: "success",
        responseMsg: "User Login Successfully ",
        responseData: useExist,
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

module.exports = userRoute;
