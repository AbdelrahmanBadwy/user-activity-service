const ACTIVITY_TYPES = {
  // types of user activities WITH our system
  PAGE_VIEW: "PAGE_VIEW",
  BUTTON_CLICK: "BUTTON_CLICK",
  FORM_SUBMIT: "FORM_SUBMIT",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
};

class ActivityType {
  constructor(type) {
    if (!Object.values(ACTIVITY_TYPES).includes(type)) {
      throw new Error(`Invalid activity type: ${type}`);
    }
    this.value = type;
  }

  toString() {
    return this.value;
  }
}

module.exports = {
  ActivityType,
  ACTIVITY_TYPES,
};
