const Koa = require("koa");
const HTTP = require("http");
const Socket = require("socket.io");

const AuthRoutes = require("../routes/auth");
const GameRoutes = require("../routes/game");
const RoomRoutes = require("../routes/room");

const Log = require("../../lib/support/log");
const Logger = require("../../lib/middleware/logger");

let app = new Koa();
let server = HTTP.createServer(app.callback());
let io = Socket(server);

io.on("connection", (socket) => {
    Log("INFO", `a new socket ${ socket.id } connected`);

    socket.use(Logger());
    socket.server = io;

    AuthRoutes(socket);
    RoomRoutes(socket);
    GameRoutes(socket);

    socket.on("disconnect", () => {
        Log("INFO", `a socket ${ socket.id } disconnected`);
        let { id, room } = socket;

        if (user && room) {
            socket.to(room.name).emit("room.quit", { member: id });
        }
    });
});


module.exports = server;