const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dogRoute = require("./routes/dog.route");
const data = require("./data/dogs.json");
const Dog = require("./models/dogs.model");
const setupSwagger = require("./swagger");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Go to /dogs to get a list of dog breeds");
});

app.use("/dogs", dogRoute);

setupSwagger(app);

async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri);
    console.log("✅ Database connected");

    const existing = await Dog.findOne();
    if (!existing) {
      await Dog.create(data);
      console.log("🌱 Initial dog data loaded");
    }
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    throw err;
  }
}

async function startServer() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
}

(async () => {
  if (process.env.NODE_ENV !== "test") {
    try {
      await connectToDatabase(process.env.MONGODB_URI);
      await startServer();
    } catch (err) {
      console.error("💥 Application failed to start.", err);
      process.exit(1);
    }
  } else {
    console.log(
      "🧪 Test environment detected. Skipping DB and server startup."
    );
  }
})();

module.exports = app;
