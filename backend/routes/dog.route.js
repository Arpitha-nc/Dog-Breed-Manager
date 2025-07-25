const express = require("express");
const dogRoute = express.Router();
const {
  getDogs,
  getDog,
  addDog,
  updateDog,
  deleteDog,
} = require("../controller/dog.controller");

dogRoute.get("/", getDogs);
dogRoute.post("/", addDog);
dogRoute.get("/:id", getDog);
dogRoute.put("/:id", updateDog);
dogRoute.delete("/:id", deleteDog);
module.exports = dogRoute;
