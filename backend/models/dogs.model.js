const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    timestamps: true,
  }
);

const Dog = mongoose.model("Dog", dogSchema);
module.exports = Dog;
