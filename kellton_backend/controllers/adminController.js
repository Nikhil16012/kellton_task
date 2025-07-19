const {
  getAllUsersService,
  deactivateUserService,
  activateUserService,
  getDashboardStatsService,
  getUserTasksService
} = require("../services/userService");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const result = await deactivateUserService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const result = await activateUserService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

const getUserTasks = async (req, res, next) => {
  try {
    const tasks = await getUserTasksService(req.params.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  deactivateUser,
  activateUser,
  getDashboardStats,
  getUserTasks
};