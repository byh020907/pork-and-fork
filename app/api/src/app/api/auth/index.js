const Router = require("koa-router");
const Auth = require("./controller");

const router = new Router();

router.post("/signup", Auth.signup);
router.post("/signin", Auth.signin);

module.exports = router;