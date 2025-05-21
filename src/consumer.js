const mongoDb = require("./infrastructure/database/mongo");
const activityConsumer = require("./interfaces/messaging/activityConsumer");
const logger = require("./shared/logger");

async function startConsumer() {
  try {
    await mongoDb.connect();

    // Start Kafka consumer
    await activityConsumer.start();
    logger.info("Consumer service started successfully");

    const shutdown = async () => {
      logger.info("Shutting down consumer...");

      try {
        await activityConsumer.stop();
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGTERM", shutdown); //kill
    process.on("SIGINT", shutdown); //Ctrl+C
  } catch (error) {
    logger.error("Failed to start consumer service:", error);
    process.exit(1);
  }
}

startConsumer();
