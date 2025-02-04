require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Queue } = require("bullmq");
const redis = require("ioredis");

// Setup Express
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Redis Connection
const redisClient = new redis(process.env.REDIS_URL);
const taskQueue = new Queue("taskQueue", { connection: redisClient });

// MongoDB Schema
const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    taskId: String,
    imageUrl: String,
    status: String,
    timestamp: { type: Date, default: Date.now },
  })
);

// API to Submit Image URL
app.post("/api/submit-task", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl)
    return res.status(400).json({ error: "Image URL is required" });

  const taskId = new mongoose.Types.ObjectId().toString();
  const newTask = new Task({ taskId, imageUrl, status: "Pending" });

  await newTask.save();
  await taskQueue.add("processTask", { taskId });

  res.json({ taskId, status: "Pending" });
});

// API to Get All Tasks
app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ timestamp: -1 });
  res.json(tasks);
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
