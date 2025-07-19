const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markComplete,
} = require("../controllers/taskController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasks);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);
router.patch("/:id/complete", verifyToken, markComplete);

module.exports = router;