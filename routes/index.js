const Router = require("express").Router;
const pageRoutes = require("./page.routes.js");
const authRoutes = require("./auth.routes.js");
const taskRoutes = require("./task.routes.js");
const router = Router();

router.use("/", pageRoutes);
router.use("/auth", authRoutes);
router.use("/task", taskRoutes);

module.exports = router;