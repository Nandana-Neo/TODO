const Router = require("express").Router;
const pageRoutes = require("./page.routes.js");
const authRoutes = require("./auth.routes.js");

const router = Router();

router.use("/", pageRoutes);
router.use("/auth", authRoutes);

module.exports = router;