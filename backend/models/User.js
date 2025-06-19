const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  institution: String,
  rollNumber: String,
  adminKey: String,
});

module.exports = mongoose.model("User", userSchema);
