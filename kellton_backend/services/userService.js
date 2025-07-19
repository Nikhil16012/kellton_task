const User = require("../models/User");
const Task = require("../models/Task");
const mongoose = require("mongoose");

const getUserProfile = async (userId) => {
  return await User.findById(userId).select("-password");
};

const updateUserProfile = async (userId, updates) => {
  return await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
};

const getAllUsersService = async () => {
  return await User.find({ role: "user" }).select("-password");
};

const deactivateUserService = async (userId) => {
  return await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
};

const activateUserService = async (userId) => {
  return await User.findByIdAndUpdate(userId, { isActive: true }, { new: true });
};

const getDashboardStatsService = async () => {
  const totalUsers = await User.countDocuments({ role: "user" });
  const activeUsers = await User.countDocuments({ role: "user", isActive: true });
  const deactivatedUsers = await User.countDocuments({ role: "user", isActive: false });
  return { totalUsers, activeUsers, deactivatedUsers };
};

const getUserTasksService = async (userId) => {
  return await Task.find({ userId: new mongoose.Types.ObjectId(userId) }).select("title status");
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllUsersService,
  deactivateUserService,
  activateUserService,
  getDashboardStatsService,
  getUserTasksService
};