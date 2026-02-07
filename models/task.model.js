const db = require("../config/db.js")

async function addTask(userId, task) {
    try{
        await db.query("INSERT INTO tasks(task, user_id) VALUES($1, $2)", [task, userId]);
        return null;
    }
    catch(error){
        console.log("error in entering data:", error);
        throw error;
    }
}

async function getTasks(userId){
    const tasks = await db.query("SELECT * FROM tasks WHERE user_id=$1;", [userId]);
    return tasks.rows;
}

async function updateTask(taskId, task=null, done=null) {
    try{
        if (task){
            await db.query("UPDATE tasks SET task=$1 WHERE id=$2;", [task, taskId]);
        }
        if (done){
            await db.query("UPDATE tasks SET done=$1 WHERE id=$2;", [done, taskId]);
        }
    }
    catch(error) {
        throw error;
    }
}

async function toggleTask(taskId){
    try{
        const {rows} = await db.query("SELECT done FROM tasks WHERE id=$1;",[taskId]);
        let done = rows[0];
        await db.query("UPDATE tasks SET done = ~done WHERE id=$1", [taskId]);
    }
    catch(error){
        throw error;
    }
}

async function deleteTask(taskId){
    try{
        await db.query("DELETE FROM tasks WHERE id=$1;",[taskId]);
        return null;
    }
    catch(error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask
}