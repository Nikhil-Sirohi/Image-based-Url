const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  taskId: String,
  imageUrl: String,
  status: { type: String, default: "Pending" },
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Task", taskSchema);
