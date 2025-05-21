require("dotenv").config();

module.exports = {
  app: {
    name: "user-activity-service",
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/user-activities",
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID || "user-activity-service",
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
    consumerGroup:
      process.env.KAFKA_CONSUMER_GROUP || "activity-processor-group",
    topics: {
      userActivities:
        process.env.KAFKA_USER_ACTIVITIES_TOPIC || "user-activities",
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
  },
};
