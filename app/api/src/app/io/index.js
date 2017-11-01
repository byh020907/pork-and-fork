const Socket = require("socket.io");
const Log = require("../../../lib/support/log");
const Logger = require("../../../lib/middleware/logger");
const Auth = require("./auth");
const Room = require("./room");

const io = Socket();

io.on("connection", (socket) => {
    Log("INFO", `a new socket ${ socket.id } connected`);

    socket.use(Logger());

    socket.broadcast.emit("room.join", { member: socket.id });

    socket.on("auth.register", (frame, ack) => {
        Auth.register(socket, frame, ack);
    });

    socket.on("auth.login", (frame, ack) => {
        Auth.login(socket, frame, ack);
    });

    socket.on("room.create", (frame, ack) => {
        Room.create(socket, frame, ack);
    });

    socket.on("room.chat", (frame, ack) => {
        Room.chat(socket, frame, ack);
    });

    socket.on("disconnect", () => {
        Log("INFO", `a socket ${ socket.id } disconnected`);
        
        socket.broadcast.emit("room.quit", { member: socket.id });
    });
});

module.exports = io;