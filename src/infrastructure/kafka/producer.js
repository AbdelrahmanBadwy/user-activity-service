const { Kafka } = require("kafkajs");
const config = require("../../shared/config");
const logger = require("../../shared/logger");

class KafkaProducer {
  constructor() {
    const kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers,
    });

    this.producer = kafka.producer();
    this.isConnected = false;
  }

  async connect() {
    try {
      await this.producer.connect();
      this.isConnected = true;
      logger.info("Kafka producer connected");
    } catch (error) {
      logger.error("Failed to connect Kafka producer:", error);
      throw error;
    }
  }

  async sendMessage(topic, message) {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      await this.producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      logger.debug(`Message sent to topic ${topic}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send message to topic ${topic}:`, error);
      throw error;
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
      logger.info("Kafka producer disconnected");
    }
  }
}

module.exports = new KafkaProducer();
