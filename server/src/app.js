const express = require("express");
const cors = require("cors");
const videosRouter = require("./routes/videos");
const { errorHandler, notFound } = require("./middleware/errorHandler");

/**
 * Builds and configures the Express application.
 * @returns {import('express').Express}
 */
function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      service: "google-videos-api",
      endpoints: { health: "/api/health", videos: "/api/videos?q=..." },
    });
  });

  app.use("/api", videosRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
