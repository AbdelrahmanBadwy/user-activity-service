const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // indexing for faster querying
  },
  activityType: {
    type: String,
    required: true,
    index: true, // indexing for faster querying
  },
  metadata: {
    type: Object,
    default: {},
  },
  processedAt: {
    type: Date,
    default: Date.now,
    index: true, // indexing for faster querying
  },
  timestamp: {
    type: Date,
    required: true,
    index: true, // indexing for faster querying
  },
});

// create compound indexes for common queries like get recent activities of a specific user (sorted by most recent)
userActivitySchema.index({ userId: 1, timestamp: -1 });
userActivitySchema.index({ activityType: 1, timestamp: -1 });

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
