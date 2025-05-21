const UserActivityRepository = require("../../infrastructure/repositories/userActivityRepository");
const logger = require("../../shared/logger");

class ActivityProcessorService {
  async processActivity(activity) {
    try {
      logger.debug(`Processing activity for user ${activity.userId}`);

      // add additional processing logic here like: ai/ml/dl models for security detection
      // for example, you could analyze the activity for anomalies or patterns
      // it's all about how you want to process the activity

      return await UserActivityRepository.saveActivity(activity); // save the activity to the database using the repository "<"
    } catch (error) {
      logger.error("Error processing activity:", error);
      throw error;
    }
  }
}

module.exports = new ActivityProcessorService();
