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
     const name = req.body.name;
     const email = req.body.email;
     const DOB = req.body.DOB;
     const phoneNumber = req.body.phoneNumber;



    const post = new Post({
      title,
      content,
      productImage,
      category,
      name,
      email,
      DOB,
      phoneNumber
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
    let { page  , limit  , sortBy  , sortOrder  ,search } = req.body;

    page = parseInt(page);
    limit = parseInt(limit);

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    const offset = (page - 1) * limit;

    let query ={}

    if (search) {
      query = { $or: [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } },{ category: { $regex: search, $options: 'i' } },{ name: { $regex: search, $options: 'i' } },{ email: { $regex: search, $options: 'i' } },{ DOB: { $regex: search, $options: 'i' } },{ phoneNumber: { $regex: search, $options: 'i' } }] };
    }

    const posts = await Post.find(query)
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

addPost.get("/:id",async(req,res)=>{
  const { id } = req.params;

  console.log("id",id);
  try{
    const posts = await Post.findById({ _id:id }).exec();
      res.json({
        responseCode: 200,
        responseStatus: "success",
        responseMsg: "successfully receive",
        responseData:posts
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

addPost.put("/:id",async(req,res)=>{
  const id = req.params.id;

  try{
    const posts = await Post.findOneAndUpdate({_id:id},req.body).exec();
      res.json({
        responseCode: 200,
        responseStatus: "success",
        responseMsg: "successfully receive",
        responseData:posts
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

addPost.delete("/:id",async(req,res)=>{
  const {id} = req.params
  try{
    const posts = await Post.deleteOne({ _id: id }).exec();
      res.json({
        responseCode: 200,
        responseStatus: "success",
        responseMsg: "successfully receive",
        responseData:posts
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





module.exports = addPost;
