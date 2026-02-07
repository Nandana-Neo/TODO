const {getTasks, addTask, deleteTask, toggleTask} = require('../models/task.model.js')

async function getTasksController(req, res) {
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    const id = req.user.id;
    const tasks = await getTasks(id);
    return res.render("index.ejs", {tasks: tasks, user:req.user});
}

async function addTaskController(req, res) {
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    const id = req.user.id;
    const task = req.body.task;
    await addTask(id, task);
    return res.redirect("/task");
}

async function deleteTaskController(req, res) {
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    const task_id = req.params.id;
    await deleteTask(task_id);
    return res.redirect("/task");
}

async function  toggleTaskController(req, res) {
    if(!req.isAuthenticated()){
        return res.redirect("/login");
    }
    const task_id = req.params.id;
    await toggleTask(task_id);
    return res.redirect("/task");
}

module.exports = {
    getTasksController,
    addTaskController,
    deleteTaskController,
    toggleTaskController
}