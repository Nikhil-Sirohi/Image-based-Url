const mongoose = require("mongoose");
const Task = require("../models/Task");
const { Queue } = require("bullmq");
const connectRedis = require("../config/redis");

const redisClient = connectRedis();
const taskQueue = new Queue("taskQueue", { connection: redisClient });

const submitTask = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl)
      return res.status(400).json({ error: "Image URL is required" });

    const taskId = new mongoose.Types.ObjectId().toString();
    const newTask = new Task({ taskId, imageUrl, status: "Pending" });
    await newTask.save();
    await taskQueue.add("processTask", { taskId });

    res.json({ taskId, status: "Pending" });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ timestamp: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};
module.exports = { submitTask, getAllTasks };
