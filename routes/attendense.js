const express = require("express");
const attendce = express.Router();
const Attendence = require("../models/atttendece");
const logger = require('../utility/logger');
const cors = require('cors');
const jwt = require('jsonwebtoken');
attendce.use(cors());



// add post
attendce.post("/", async (req, res) => {
  try {
    const data = req.body.requestData;
    const attendence = data.map(elm => new Attendence(elm));



    // Use Promise.all() to save all documents asynchronously
    await Promise.all(attendence.map(post => post.save()));
    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "Attendce Added SuccessFully",
      responseData: attendence,
    });
  } catch (error) {
    console.error(error);
    res.json({
      responseCode: 500,
      responseStatus: "error",
      responseMsg: "Error In Route",
      responseData: post,
    });
  }
});


attendce.post("/listing", async (req, res) => {
    try {
      let { page  , limit  , sortBy  , sortOrder  ,search } = req.body;

      page = parseInt(page);
      limit = parseInt(limit);

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder;

      const totalAttednce = await Attendence.countDocuments();
      const totalPages = Math.ceil(totalAttednce / limit);
      const offset = (page - 1) * limit;

      let query ={}

      if (search) {
        query = { $or: [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } },{ category: { $regex: search, $options: 'i' } },{ name: { $regex: search, $options: 'i' } },{ email: { $regex: search, $options: 'i' } },{ DOB: { $regex: search, $options: 'i' } },{ phoneNumber: { $regex: search, $options: 'i' } }] };
      }

      const attendence = await Attendence.find(query)
        .sort(sortOptions)
        .limit(limit)
        .skip(offset)
        .exec();

      res.json({
        responseCode: 200,
        responseStatus: "success",
        responseMsg: "successfully received",
        responseData: {
          attendence,
          totalPages,
          currentPage: page
        }
      });
    } catch (err) {
      console.log(err);
      res.json({
        responseCode: 500,
        responseStatus: "error",
        responseMsg: "Error In Route",
      });
    }
  });


  attendce.put("/:id",async(req,res)=>{
    const id = req.params.id;

    try{
      const attence = await Attendence.findOneAndUpdate({_id:id},req.body).exec();
        res.json({
          responseCode: 200,
          responseStatus: "success",
          responseMsg: "successfully receive",
          responseData:attence
        });

    }catch(err){
      console.log(err);
      res.json({
        responseCode: 500,
        responseStatus: "error",
        responseMsg: "Error In Route",
      });
    }
  })

  attendce.delete("/:id",async(req,res)=>{
    const id = req.params.id;

    try{
      const attence = await Attendence.findByIdAndDelete({_id:id}).exec();
        res.json({
          responseCode: 200,
          responseStatus: "success",
          responseMsg: "successfully receive",
          responseData:attence
        });

    }catch(err){
      console.log(err);
      res.json({
        responseCode: 500,
        responseStatus: "error",
        responseMsg: "Error In Route",
      });
    }
  })





module.exports = attendce;
