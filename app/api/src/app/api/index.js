const Router = require("koa-router");
const Auth = require("./auth");

const router = new Router();
router.use("/auth", Auth.routes());

module.exports = router;
