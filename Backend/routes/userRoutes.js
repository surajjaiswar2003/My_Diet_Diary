const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/count", userController.getUserCount);
router.get("/new-this-month", userController.getNewUsersThisMonth);
router.get("/active-this-week", userController.getActiveUsersThisWeek);
router.get("/growth", userController.getUserGrowth);
router.get("/activity-stats", userController.getUserActivityStats);

module.exports = router;
