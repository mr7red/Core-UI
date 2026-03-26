const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    image: String,

    startDate: Date,
    endDate: Date,
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Blog", BlogSchema);