const express = require("express");
const router = express.Router();
const {
  getUserNotifications,
  markNotificationAsRead,
} = require("../controllers/notificationController");
const { authenticateUser } = require("../middleware/auth");

router.get("/", authenticateUser, getUserNotifications);

router.put("/:id/read", authenticateUser, markNotificationAsRead);

module.exports = router;
