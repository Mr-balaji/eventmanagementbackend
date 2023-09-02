const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    productImage:{
        type:String,
        // required:true
    }
},
 {
        writeConcern: {
           w: 'majority',
           j: true,
           wtimeout: 1000
        }
})

module.exports = mongoose.model("post",postSchema);
