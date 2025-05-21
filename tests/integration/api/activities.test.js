const request = require("supertest");
const app = require("../../../src/interfaces/http/app");
const mongoDb = require("../../../src/infrastructure/database/mongo");
const UserActivityModel = require("../../../src/infrastructure/database/schemas/userActivitySchema");

describe("User Activity API", () => {
  beforeAll(async () => {
    await mongoDb.connect();
  });

  beforeEach(async () => {
    await UserActivityModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /api/activities", () => {
    it("should create a new activity", async () => {
      const response = await request(app)
        .post("/api/activities")
        .send({
          userId: "test123",
          activityType: "PAGE_VIEW",
          metadata: { page: "/test" },
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.activity.userId).toBe("test123");
    });

    it("should return 400 when userId is missing", async () => {
      const response = await request(app)
        .post("/api/activities")
        .send({
          activityType: "PAGE_VIEW",
          metadata: { page: "/test" },
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });
  });

  describe("GET /api/activities", () => {
    beforeEach(async () => {
      // Create test activities
      await UserActivityModel.create([
        {
          userId: "user1",
          activityType: "PAGE_VIEW",
          metadata: { page: "/home" },
          timestamp: new Date("2023-01-01"),
        },
        {
          userId: "user1",
          activityType: "BUTTON_CLICK",
          metadata: { button: "submit" },
          timestamp: new Date("2023-01-02"),
        },
        {
          userId: "user2",
          activityType: "LOGIN",
          metadata: {},
          timestamp: new Date("2023-01-03"),
        },
      ]);
    });

    it("should return all activities when no filters provided", async () => {
      const response = await request(app).get("/api/activities");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(3);
    });

    it("should filter activities by userId", async () => {
      const response = await request(app)
        .get("/api/activities")
        .query({ userId: "user1" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].userId).toBe("user1");
    });

    it("should filter activities by date range", async () => {
      const response = await request(app).get("/api/activities").query({
        startDate: "2023-01-02",
        endDate: "2023-01-03",
      });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
    });

    it("should return paginated results", async () => {
      const response = await request(app)
        .get("/api/activities")
        .query({ page: 1, limit: 2 });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.totalPages).toBe(2);
    });
  });
});
