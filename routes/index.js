const Router = require("express").Router;
const pageRoutes = require("./page.routes.js");

const router = Router();

router.use("/", pageRoutes);

module.exports = router;