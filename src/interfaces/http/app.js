const express = require("express");
const activityRoutes = require("./routes/userActivityRoutes");

const app = express();

app.use(express.json());

app.use("/api/activities", activityRoutes);

// health check endpoint made it for easy to check if the service is up and running
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
