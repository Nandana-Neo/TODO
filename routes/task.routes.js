const Router = require('express').Router;
const router = Router();
const {getTasksController, addTaskController, deleteTaskController, toggleTaskController} = require("../contollers/task.controllers.js")

// Get all tasks of user
router.get("/", getTasksController);
router.post("/", addTaskController);
router.post("/delete/:id", deleteTaskController);
router.post("/toggle/:id", toggleTaskController);

module.exports = router;