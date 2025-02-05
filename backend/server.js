require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const connectRedis = require("./config/redis");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const main = async () => {
  // Initialize Express app
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Connect to Database
  await connectDB();
  await connectRedis();

  // Routes
  app.use("/api/tasks", taskRoutes);

  // Global Error Handling Middleware
  app.use(errorHandler);

  // Start Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

main().then(() => {
  console.log("server started");
});
