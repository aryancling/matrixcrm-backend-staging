const mongoose = require("mongoose");
const logger = require("./logger.config");
require("dotenv").config();

mongoose
  .connect(
    `mongodb://${process.env.DATABASE_USERNAME}:${encodeURIComponent(
      process.env.DATABASE_PASSWORD
    )}@${process.env.DATABASE_URL}`,
    {
      useNewUrlParser: true,
    }
  )
  .then(() => {
    logger.info("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    logger.error("🚫 MongoDB connection failed", err);
  });
