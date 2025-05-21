# User Activity Service

A scalable, event-driven microservice for processing and analyzing user activities leveraging a Domain Driven Architecture with Node.js, Kafka, and MongoDB.

![Node.js Version](https://img.shields.io/badge/node-%3E%3D16-brightgreen)
![MongoDB Version](https://img.shields.io/badge/mongodb-%3E%3D4.4-blue)
![Kafka Version](https://img.shields.io/badge/kafka-%3E%3D2.8-orange)

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Kafka Message Structure](#kafka-message-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Monitoring and Logging](#monitoring-and-logging)
- [Contributing](#contributing)

## Overview

The User Activity Service collects, processes, and analyzes user activities in real-time. It captures user interactions, stores them in MongoDB, and publishes events to Kafka for further processing and analytics. This service is designed with scalability and reliability in mind, using a hexagonal architecture to maintain clear separation of concerns.

## Architecture

The service follows a hexagonal (ports and adapters) architecture pattern to create a maintainable and scalable codebase with clear boundaries between different layers:

- **Domain Layer**: Contains the core business logic and domain models
- **Application Layer**: Orchestrates the use cases and application workflows
- **Infrastructure Layer**: Handles external dependencies like databases and messaging systems
- **Interface Layer**: Provides HTTP API endpoints and message consumers

### Architecture Choices

I've chosen this architecture for several key reasons:

1. **Separation of Concerns**: The hexagonal architecture keeps business logic isolated from external concerns like databases and messaging systems, making the code more maintainable and testable.

2. **Technology Independence**: The domain and application layers are completely decoupled from infrastructure implementations, allowing you to swap out MongoDB or Kafka for alternative solutions without affecting business logic.

3. **Scalability**: The event-driven approach using Kafka enables horizontal scaling of both the API service and the consumer independently based on demand.

4. **Resilience**: By separating the processing of activities into a separate consumer service, we ensure that high traffic won't impact the API responsiveness, and failed processing can be retried without affecting the user experience.

5. **Testability**: The clean separation between layers makes unit testing, integration testing, and mocking much easier.

## Prerequisites

- **Node.js**: v16 or later
- **Docker and Docker Compose**: Latest stable version
- **MongoDB**: v4.4 or later
- **Kafka**: v2.8 or later

## Setup Instructions

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AbdelrahmanBadwy/Microservice_Projects.git
   cd user-activity-service
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory based on the example below:

   ```
   # Server
   PORT=3000
   NODE_ENV=development

   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/user-activity

   # Kafka
   KAFKA_BROKERS=localhost:9092
   KAFKA_CLIENT_ID=user-activity-service
   KAFKA_GROUP_ID=user-activity-consumers

   # Topics
   KAFKA_ACTIVITY_TOPIC=user-activities
   KAFKA_PROCESSED_ACTIVITY_TOPIC=processed-activities

   # Logging
   LOG_LEVEL=info
   ```

4. **Start the local environment using Docker Compose**

   ```bash
   docker-compose up -d
   ```

   This will start MongoDB, Zookeeper, and Kafka in Docker containers.

5. **Start the API server**

   ```bash
   npm run dev:server
   ```

6. **Start the consumer service (in a separate terminal)**

   ```bash
   npm run dev:consumer
   ```

### Production Deployment with Docker

1. **Build the Docker images**

   ```bash
   docker build -t user-activity-api:latest -f Dockerfile .
   docker build -t user-activity-consumer:latest -f Dockerfile.consumer .
   ```

2. **Run with production Docker Compose**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## API Endpoints

### Activity Management

- **POST /api/activities**

  - Log a new user activity
  - Request body:
    ```json
    {
      "userId": "string",
      "type": "string",
      "metadata": {
        "key1": "value1",
        "key2": "value2"
      }
    }
    ```
  - Response: 201 Created
    ```json
    {
      "id": "string",
      "userId": "string",
      "type": "string",
      "metadata": {},
      "createdAt": "date"
    }
    ```

- **GET /api/activities**

  - Get user activities with filtering and pagination
  - Query parameters:
    - `userId` (optional): Filter by user ID
    - `type` (optional): Filter by activity type
    - `startDate` (optional): Filter by date range start
    - `endDate` (optional): Filter by date range end
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Items per page (default: 20)
  - Response: 200 OK
    ```json
    {
      "items": [
        {
          "id": "string",
          "userId": "string",
          "type": "string",
          "metadata": {},
          "createdAt": "date"
        }
      ],
      "totalCount": 100,
      "page": 1,
      "limit": 20
    }
    ```

- **GET /api/activities/types**
  - Get available activity types
  - Response: 200 OK
    ```json
    {
      "types": ["login", "view", "purchase", "share"]
    }
    ```

## Kafka Message Structure

### User Activity Topic

```json
{
  "id": "string",
  "userId": "string",
  "type": "string",
  "metadata": {},
  "createdAt": "date"
}
```

### Processed Activity Topic

```json
{
  "id": "string",
  "userId": "string",
  "type": "string",
  "metadata": {},
  "createdAt": "date",
  "processedAt": "date",
  "enrichedData": {}
}
```

## Environment Variables

| Variable                       | Description                                 | Default                                 |
| ------------------------------ | ------------------------------------------- | --------------------------------------- |
| PORT                           | HTTP server port                            | 3000                                    |
| NODE_ENV                       | Environment (development, test, production) | development                             |
| MONGODB_URI                    | MongoDB connection string                   | mongodb://localhost:27017/user-activity |
| KAFKA_BROKERS                  | Comma-separated list of Kafka brokers       | localhost:9092                          |
| KAFKA_CLIENT_ID                | Client ID for Kafka producer                | user-activity-service                   |
| KAFKA_GROUP_ID                 | Consumer group ID                           | user-activity-consumers                 |
| KAFKA_ACTIVITY_TOPIC           | Topic for user activities                   | user-activities                         |
| KAFKA_PROCESSED_ACTIVITY_TOPIC | Topic for processed activities              | processed-activities                    |
| LOG_LEVEL                      | Logging level                               | info                                    |

## Development

### Project Structure

```
user-activity-service/
│
├── src/
│   ├── application/
│   │   └── services/
│   │       ├── userActivityService.js
│   │       └── activityProcessorService.js
│   │
│   ├── domain/
│   │   ├── models/
│   │   │   └── UserActivity.js
│   │   └── valueObjects/
│   │       └── ActivityType.js
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── mongo.js
│   │   │   └── schemas/
│   │   │       └── userActivitySchema.js
│   │   ├── kafka/
│   │   │   ├── producer.js
│   │   │   └── consumer.js
│   │   └── repositories/
│   │       └── userActivityRepository.js
│   │
│   ├── interfaces/
│   │   ├── http/
│   │   │   ├── app.js
│   │   │   ├── controllers/
│   │   │   │   └── userActivityController.js
│   │   │   └── routes/
│   │   │       └── userActivityRoutes.js
│   │   └── messaging/
│   │       └── activityConsumer.js
│   │
│   ├── shared/
│   │   ├── config.js
│   │   └── logger.js
│   │
│   ├── server.js
│   └── consumer.js
│
├── tests/
│   ├── unit/
│   │   └── domain/
│   │       └── UserActivity.test.js
│   └── integration/
│       └── api/
│           └── activities.test.js
│
├── k8s/
│   ├── api-deployment.yaml
│   ├── consumer-deployment.yaml
│   ├── kafka-deployment.yaml
│   └── mongodb-deployment.yaml
│
├── .env
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── Dockerfile.consumer
├── package.json
└── README.md
```

### Available Scripts

- `npm run dev:server`: Start API server with hot reloading
- `npm run dev:consumer`: Start Kafka consumer with hot reloading
- `npm run lint`: Run ESLint
- `npm run test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report
- `npm start`: Start production server
- `npm run start:consumer`: Start production consumer

## Testing

This project uses Jest for testing:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

## Kubernetes Deployment

Kubernetes deployment files are located in the `k8s/` directory:

```bash
# Deploy to Kubernetes
kubectl apply -f k8s/
```

The deployment includes:

- API server deployment and service
- Consumer deployment
- MongoDB statefulset
- Kafka and Zookeeper deployment (if not using a managed service)

## Monitoring and Logging

- Logging is handled by a structured logger in `shared/logger.js`
- Health check endpoints are available at `/health` and `/ready`
- Prometheus metrics are exposed at `/metrics`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
