const {
  createTaskService,
  getUserTasks,
  updateTaskService,
  deleteTaskService,
  markTaskComplete,
} = require("../services/taskService");

const createTask = async (req, res, next) => {
  try {
    const task = await createTaskService(req.user.id, req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await getUserTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const updated = await updateTaskService(req.params.id, req.body, req.user.id);
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const deleted = await deleteTaskService(req.params.id);
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};

const markComplete = async (req, res, next) => {
  try {
    const updated = await markTaskComplete(req.params.id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  markComplete,
};