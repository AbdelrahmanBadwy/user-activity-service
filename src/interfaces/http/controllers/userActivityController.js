const userActivityService = require("../../../application/services/userActivityService");
const { ACTIVITY_TYPES } = require("../../../domain/valueObjects/ActivityType");
const logger = require("../../../shared/logger");

exports.logActivity = async (req, res) => {
  try {
    const { userId, activityType, metadata } = req.body;

    if (!userId || !activityType) {
      return res.status(400).json({
        error: "Missing required fields: userId and activityType are required",
      });
    }

    const result = await userActivityService.logActivity(
      userId,
      activityType,
      metadata
    );
    return res.status(201).json(result);
  } catch (error) {
    logger.error("Error in log activity controller:", error);
    return res.status(400).json({ error: error.message });
  }
};

exports.getActivities = async (req, res) => {
  try {
    // Extract query parameters
    const {
      userId,
      activityType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filters
    const filters = {};
    if (userId) filters.userId = userId;
    if (activityType) filters.activityType = activityType;

    // Date range filter
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }

    // Pagination
    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const activities = await userActivityService.getActivities(
      filters,
      pagination
    );
    return res.json(activities);
  } catch (error) {
    logger.error("Error in get activities controller:", error);
    return res.status(500).json({ error: "Failed to retrieve activities" });
  }
};

exports.getActivityTypes = (req, res) => {
  return res.json(ACTIVITY_TYPES);
};
