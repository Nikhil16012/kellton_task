const Task = require("../models/Task");

const createTaskService = async (userId, taskData) => {
  return await Task.create({ ...taskData, userId });
};

const getUserTasks = async (userId) => {
  return await Task.find({ userId }).sort({ dueDate: 1 });
};

const updateTaskService = async (taskId, updates, userId) => {
  return await Task.findOneAndUpdate({ _id: taskId, userId }, updates, { new: true });
};

const deleteTaskService = async (taskId) => {
  return await Task.findByIdAndDelete(taskId);
};

const markTaskComplete = async (taskId) => {
  return await Task.findByIdAndUpdate(taskId, { status: "completed" }, { new: true });
};

module.exports = {
  createTaskService,
  getUserTasks,
  updateTaskService,
  deleteTaskService,
  markTaskComplete
};