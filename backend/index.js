const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dogRoute = require("./routes/dog.route");
const data = require("./data/dogs.json");
const Dog = require("./models/dogs.model");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/dogs", dogRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("DB connected");

    const existing = await Dog.findOne();
    if (!existing) {
      await Dog.create(data);
      console.log("Initial dog data loaded");
    }

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
