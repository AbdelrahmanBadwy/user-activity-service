const { Kafka } = require("kafkajs");
const config = require("../../shared/config");
const logger = require("../../shared/logger");

class KafkaConsumer {
  constructor() {
    const kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
    });

    this.consumer = kafka.consumer({
      groupId: config.kafka.consumerGroup,
    });
    this.isConnected = false;
  }

  async connect() {
    try {
      await this.consumer.connect();
      this.isConnected = true;
      logger.info("Kafka consumer connected");
    } catch (error) {
      logger.error("Failed to connect Kafka consumer:", error);
      throw error;
    }
  }

  async subscribe(topics) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      for (const topic of topics) {
        await this.consumer.subscribe({
          topic,
          fromBeginning: false,
        });
      }
      logger.info(`Subscribed to topics: ${topics.join(", ")}`);
    } catch (error) {
      logger.error(
        `Failed to subscribe to topics: ${topics.join(", ")}`,
        error
      );
      throw error;
    }
  }

  async consume(messageHandler) {
    if (!this.isConnected) {
      throw new Error("Consumer is not connected");
    }

    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const messageValue = message.value.toString();
          logger.debug(`Received message from ${topic}[${partition}]`);

          try {
            const parsedMessage = JSON.parse(messageValue);
            await messageHandler(topic, parsedMessage);
          } catch (error) {
            logger.error("Error processing message:", error);
          }
        },
      });
    } catch (error) {
      logger.error("Failed to start consumer:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.consumer.disconnect();
      this.isConnected = false;
      logger.info("Kafka consumer disconnected");
    }
  }
}

module.exports = new KafkaConsumer();
