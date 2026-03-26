const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password:String,
  profile: String,
  banner: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
},{
  timestamps: true
});

module.exports = mongoose.model("SuperAdmin", schema);