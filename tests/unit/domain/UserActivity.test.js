const UserActivity = require("../../../src/domain/models/UserActivity");

describe("UserActivity Domain Model", () => {
  it("should create a valid user activity", () => {
    const activity = new UserActivity("user123", "PAGE_VIEW", {
      page: "/home",
    });

    expect(activity.userId).toBe("user123");
    expect(activity.activityType).toBe("PAGE_VIEW");
    expect(activity.metadata.page).toBe("/home");
    expect(activity.timestamp).toBeInstanceOf(Date);
  });

  it("should throw error when userId is missing", () => {
    expect(() => {
      const activity = new UserActivity(null, "PAGE_VIEW", {});
      activity.validate();
    }).toThrow("User ID is required");
  });

  it("should throw error when activityType is missing", () => {
    expect(() => {
      const activity = new UserActivity("user123", null, {});
      activity.validate();
    }).toThrow("Activity type is required");
  });
});
