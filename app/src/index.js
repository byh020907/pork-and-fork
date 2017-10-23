const Koa = require("koa");
const Router = require("koa-router");
const Body = require("koa-bodyparser");
const CORS = require("koa2-cors");
const Serve = require("koa-static");
const Logger = require("../lib/middleware/http/logger");
const Log = require("../lib/support/log");
const Config = require("../lib/support/config");
const Sample = require("./sample");

const app = new Koa();
const router = new Router();

app.use(Body());
app.use(Logger());
app.use(CORS());
app.use(Serve("./files"))

router.use("/sample", Sample.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const { app: { http: { port } } } = Config;

app.listen(port, () => {
    Log("INFO", `server was running on ${ port } port`);
});