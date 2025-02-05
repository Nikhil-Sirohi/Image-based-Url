const express = require("express");
const { submitTask, getAllTasks } = require("../controllers/taskController");
const router = express.Router();
router.post("/", submitTask);
router.get("/", getAllTasks);
module.exports = router;
