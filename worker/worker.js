require("dotenv").config();
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const redis = require("ioredis");
const axios = require("axios");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Worker: MongoDB Connected"))
  .catch((err) => console.error(err));

// Redis Connection
const redisClient = new redis(process.env.REDIS_URL);
const taskWorker = new Worker(
  "taskQueue",
  async (job) => {
    const { taskId } = job.data;
    const task = await mongoose.model("Task").findOne({ taskId });

    if (!task) return;

    task.status = "Processing";
    await task.save();

    await new Promise((resolve) => setTimeout(resolve, 60000)); // Simulate 1-minute processing

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
