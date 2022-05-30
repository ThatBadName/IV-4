const mongoose = require("mongoose");

const premiumCode = mongoose.Schema({
  code: String,
  plan: String
});

module.exports = mongoose.model("premium-codes", premiumCode);