const express = require("express");
const {
  getAllUsers,
  deactivateUser,
  activateUser,
  getDashboardStats,
  getUserTasks
} = require("../controllers/adminController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.patch("/users/:id/deactivate", verifyToken, verifyAdmin, deactivateUser);
router.patch("/users/:id/activate", verifyToken, verifyAdmin, activateUser);
router.get("/dashboard", verifyToken, verifyAdmin, getDashboardStats);
router.get("/users/:id/tasks", verifyToken, verifyAdmin, getUserTasks);

module.exports = router;