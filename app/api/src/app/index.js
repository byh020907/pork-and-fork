const Koa = require("koa");
const Router = require("koa-router");
const Body = require("koa-bodyparser");
const CORS = require("koa2-cors");
const HTTP = require("http");
const Log = require("../../lib/support/log");
const Logger = require("../../lib/middleware/api/logger");
const API = require("./api");
const IO = require("./io");

const app = new Koa();
const router = new Router();

app.use(Body());
app.use(CORS());
app.use(Logger());

router.use("/api", API.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const server = HTTP.createServer(app.callback());

IO.attach(server);

module.exports = server;