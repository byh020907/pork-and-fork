const Router = require("koa-router");
const Sample = require("./controller");

const router = new Router();
router.get("/", Sample.sample);

module.exports = router;