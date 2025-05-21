class UserActivity {
  constructor(userId, activityType, metadata, timestamp = new Date()) {
    this.userId = userId;
    this.activityType = activityType;
    this.metadata = metadata;
    this.timestamp = timestamp;
  }

  validate() {
    // here we validate also about the use-case
    if (!this.userId) throw new Error("User ID is required");
    if (!this.activityType) throw new Error("Activity type is required");

    return true;
  }
}

module.exports = UserActivity;
