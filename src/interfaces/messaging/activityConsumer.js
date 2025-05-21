const kafkaConsumer = require("../../infrastructure/kafka/consumer");
const activityProcessorService = require("../../application/services/activityProcessorService");
const config = require("../../shared/config");
const logger = require("../../shared/logger");

class ActivityConsumer {
  async start() {
    try {
      await kafkaConsumer.connect();
      await kafkaConsumer.subscribe([config.kafka.topics.userActivities]);

      await kafkaConsumer.consume(async (topic, message) => {
        logger.info(`Processing message from topic: ${topic}`);
        await activityProcessorService.processActivity(message);
      });

      logger.info("Activity consumer started successfully");
    } catch (error) {
      logger.error("Failed to start activity consumer:", error);
      throw error;
    }
  }

  async stop() {
    try {
      await kafkaConsumer.disconnect();
      logger.info("Activity consumer stopped");
    } catch (error) {
      logger.error("Error stopping activity consumer:", error);
    }
  }
}

module.exports = new ActivityConsumer();
