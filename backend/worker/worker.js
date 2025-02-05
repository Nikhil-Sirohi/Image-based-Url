require("dotenv").config({ path: __dirname + "/../" + ".env" });
const mongoose = require("mongoose");
const { Worker } = require("bullmq");
const axios = require("axios");
const Task = require("../models/Task");
const connectRedis = require("../config/redis");
const connectDB = require("../config/db");

const processJob = async (job) => {
  const { taskId } = job.data;
  console.log(`Processing task: ${taskId}`);

  try {
    const task = await Task.findOne({ taskId });

    if (!task) {
      console.error(`Task not found: ${taskId}`);
      return;
    }

    // Update status to "Processing"
    task.status = "Processing";
    await task.save();
    console.log(`Task ${taskId} status updated to Processing`);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 60000));

    // Check image URL
    const isValidURL = await testURL(task.imageUrl);
    if (isValidURL) {
      task.status = "Success";
    } else {
      task.status = "Failed";
    }
    await task.save();
    console.log(`Task ${taskId} status updated`);
  } catch (error) {
    console.error(`Error processing task ${taskId}`, error);
  }
};

const testURL = async (url) => {
  try {
    await axios.get(url);
    return true;
  } catch (err) {
    return false;
  }
};

const main = async () => {
  const redisClient = await connectRedis();
  await connectDB();
  new Worker("taskQueue", processJob, {
    connection: redisClient,
    concurrency: 2,
  });
};

main().then(() => console.log("worker started"));
