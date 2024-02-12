const express = require("express");
const addPost = express.Router();
const Post = require("../models/post");
const logger = require('../utility/logger');
const cors = require('cors');
const jwt = require('jsonwebtoken');
addPost.use(cors());
const multer = require('multer');


const upload = multer({dest:'uploads/'})
addPost.use("/uploads",express.static('uploads'));

// add post
addPost.post("/", upload.single("postImg"), async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const productImage = req.file?.path; // Assuming the image file is uploaded as "postImg"
    const category = req.body.category;
    const post = new Post({
      title,
      content,
      productImage,
      category,
    });
    await post.save();
    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "Post Added SuccessFully",
      responseData: post,
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


addPost.post("/listing", async (req, res) => {
  try {
    let { page = page || 1, limit = limit || 5, sortBy = sortBy || '_id', sortOrder = sortOrder || 1 } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    const posts = await Post.find()
      .sort(sortOptions)
      .limit(limit)
      .skip(offset)
      .exec();

    res.json({
      responseCode: 200,
      responseStatus: "success",
      responseMsg: "successfully received",
      responseData: {
        posts,
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
// get post by category
addPost.post("/category",async(req,res)=>{
  const category = req.body.category;
  try{
    const posts = await Post.find({ category }).exec();

    console.log("post",posts.length);
    // if(posts.length === 0){
    //   res.json({
    //     responseCode: 404,
    //     responseStatus: "success",
    //     responseMsg: "No Post Available",
    //     responseData:posts
    //   });

    // } else {
      res.json({
        responseCode: 200,
        responseStatus: "success",
        responseMsg: "successfully receive",
        responseData:posts
      });
    // }


  }catch(err){
    console.log(err);
    res.json({
      responseCode: 500,
      responseStatus: "error",
      responseMsg: "Error In Route",
    });
  }
})



module.exports = addPost;
