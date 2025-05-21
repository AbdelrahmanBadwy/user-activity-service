const express = require("express");
const userActivityController = require("../controllers/userActivityController");

const router = express.Router();

router.post("/", userActivityController.logActivity);
router.get("/", userActivityController.getActivities);
router.get("/types", userActivityController.getActivityTypes);

module.exports = router;
