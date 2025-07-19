const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerService = async ({ fullName, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ fullName, email, password: hashedPassword, role: role || "user" });

  const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { user: newUser, token };
};

const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email: new RegExp(`^${email}$`, "i") });
  if (!user || !user.isActive) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { user, token };
};

module.exports = { registerService, loginService };