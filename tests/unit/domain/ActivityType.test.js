const {
  ActivityType,
  ACTIVITY_TYPES,
} = require("../../../src/domain/valueObjects/ActivityType");

describe("ActivityType Value Object", () => {
  it("should create a valid activity type", () => {
    const activityType = new ActivityType(ACTIVITY_TYPES.PAGE_VIEW);
    expect(activityType.toString()).toBe(ACTIVITY_TYPES.PAGE_VIEW);
  });

  it("should throw error for invalid activity type", () => {
    expect(() => {
      new ActivityType("INVALID_TYPE");
    }).toThrow("Invalid activity type: INVALID_TYPE");
  });
});
