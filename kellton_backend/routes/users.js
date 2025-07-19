const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/me", verifyToken, getProfile);
router.put("/me", verifyToken, updateProfile);

module.exports = router;