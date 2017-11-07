const Socket = require("socket.io");
const Log = require("../../../lib/support/log");
const Logger = require("../../../lib/middleware/logger");
const Auth = require("./auth");
const Room = require("./room");

const io = Socket();

io.on("connection", (socket) => {
    Log("INFO", `a new socket ${ socket.id } connected`);

    socket.use(Logger());

    socket.io = io;

    socket.on("auth.register", (frame, ack) => {
        Auth.register(socket, frame, ack);
    });

    socket.on("auth.check", (frame, ack) => {
        Auth.check(socket, frame, ack);
    })

    socket.on("auth.login", (frame, ack) => {
        Auth.login(socket, frame, ack);
    });

    socket.on("room.create", (frame, ack) => {
        Room.create(socket, frame, ack);
    });

    socket.on("room.list", (frame, ack) => {
        Room.list(socket, ack);
    });

    socket.on("room.join", (frame, ack) => {
        Room.join(socket, frame, ack);
    });

    socket.on("room.quit", (frame, ack) => {
        Room.quit(socket, ack);
    });

    socket.on("room.chat", (frame, ack) => {
        Room.chat(socket, frame, ack);
    });

    socket.on("disconnect", () => {
        Log("INFO", `a socket ${ socket.id } disconnected`);

        const { user, room } = socket;

        if (user && room) {
            socket.to(room.name).emit("room.quit", { member: user.id });
        }
    });
});

module.exports = io;