const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    image:{
        type:String
    },

    description:{
        type:String
    },

    parentCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        default:null
    },

    status:{
        type:Boolean,
        default:true
    }

},{timestamps:true});

module.exports = mongoose.model("Category",categorySchema);