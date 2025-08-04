const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dogRoute = require("./routes/dog.route");
const data = require("./data/dogs.json");
const Dog = require("./models/dogs.model");
const setupSwagger = require("./swagger");
const logger = require("./logger");

dotenv.config();

const app = express();
const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

app.use((req, res, next) => {
  const start = process.hrtime();
  res.on("finish", () => {
    const durationInMs = getDurationInMilliseconds(start);
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${durationInMs.toLocaleString()}ms`
    );
  });
  next();
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/dogs", dogRoute);

setupSwagger(app);

async function connectToDatabase(uri) {
  try {
    await mongoose.connect(uri);
    logger.info("✅ Database connected");

    const existing = await Dog.findOne();
    if (!existing) {
      await Dog.create(data);
      logger.info("🌱 Initial dog data loaded");
    }
  } catch (err) {
    logger.error("❌ Failed to connect to database:", err);
    throw err;
  }
}

async function startServer() {
  const port = process.env.PORT || 3000;
  const server = app.listen(port, () => {
    logger.info(`🚀 Server listening on port ${port}`);
  });

  process.on("SIGINT", () => {
    logger.info("Received SIGINT. Closing server...");
    server.close(() => {
      logger.info("Server closed. Exiting process...");
      process.exit(0);
    });
  });

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM. Closing server...");
    server.close(() => {
      logger.info("Server closed. Exiting process...");
      process.exit(0);
    });
  });
}

(async () => {
  if (process.env.NODE_ENV !== "test") {
    try {
      await connectToDatabase(process.env.MONGODB_URI);
      await startServer();
    } catch (err) {
      logger.error("💥 Application failed to start.", err);
      process.exit(1);
    }
  } else {
    logger.info(
      "🧪 Test environment detected. Skipping DB and server startup."
    );
  }
})();

module.exports = app;
