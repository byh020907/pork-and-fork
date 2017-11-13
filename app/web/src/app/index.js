const Koa = require("koa");
const Router = require("koa-router");
const Send = require("koa-send");
const Serve = require("koa-static");
const Mount = require("koa-mount");
const Log = require("../../lib/support/log");
const Logger = require("../../lib/middleware/logger");

const app = new Koa();
const router = new Router();

app.use(Logger());
app.use(Mount("/static", Serve("./files")));

router.get("/", async (ctx) => {
    await Send(ctx, "main.html", { root: "./files" });
});

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;