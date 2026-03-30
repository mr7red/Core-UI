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
  profile: {
    url: String,
    public_id: String
  },
  banner: {
  url: String,
  public_id: String
},
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  resetOtp: String,
  resetOtpExpire: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("User", userSchema);