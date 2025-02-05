require("dotenv").config();
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const axios = require("axios");
const Task = require("../models/Task");
const connectRedis = require("../config/redis");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Worker: MongoDB Connected"))
  .catch((err) => console.error(err));

const redisClient = connectRedis();

const taskWorker = new Worker(
  "taskQueue",
  async (job) => {
    const { taskId } = job.data;
    const task = await Task.findOne({ taskId });
    if (!task) return;

    task.status = "Processing";
    await task.save();

    await new Promise((resolve) => setTimeout(resolve, 60000)); // Simulate processing

    try {
      await axios.get(task.imageUrl);
      task.status = "Success";
    } catch (error) {
      task.status = "Failed";
    }

    await task.save();
  },
  { connection: redisClient, concurrency: 2 }
);

console.log("Worker is running...");
