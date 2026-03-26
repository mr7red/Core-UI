const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: String,
  email: {
  type: String,
  unique: true,
  required: true
},
  city: String,
  password: String,
  profile: String,
  banner: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
},{
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);