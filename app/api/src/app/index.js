const Koa = require("koa");
const HTTP = require("http");
const IO = require("./io");

const app = new Koa();

const server = HTTP.createServer(app.callback());

IO.attach(server, { cookie: false });

module.exports = server;