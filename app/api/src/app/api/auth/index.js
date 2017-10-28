const Router = require("koa-router");
const Auth = require("./controller");

const router = new Router();

router.post("/signup", Auth.signUp);
router.post("/signin", Auth.signIn);

module.exports = router;