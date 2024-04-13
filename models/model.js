const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  verified: Boolean,
  password: String
});

module.exports = mongoose.model("User", userSchema);
