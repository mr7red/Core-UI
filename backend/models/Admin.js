const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profile: {
    url: String,
    public_id: String
  },
  banner: {
    url: String,
    public_id: String
  }, role: String,
}, {
  timestamps: true
});

module.exports = mongoose.model("admin", adminSchema);
