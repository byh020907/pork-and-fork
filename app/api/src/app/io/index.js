const Socket = require("socket.io");
const Log = require("../../../lib/support/log");
const Logger = require("../../../lib/middleware/io/logger");

const io = Socket();

io.on("connection", (socket) => {
    Log("INFO", `a new socket ${ socket.id } connected`);

    socket.use(Logger());

    socket.broadcast.emit("room.join", { member: socket.id });

    socket.on("room.chat", (frame, ack) => {
        const { message } = frame;
        const sender = socket.id;

        try {
            socket.broadcast.emit("room.chat", { message, sender });
        } catch (e) {
            ack(false);
            return console.error(e);
        }

        ack(true);
    });

    socket.on("disconnect", () => {
        Log("INFO", `a socket ${ socket.id } disconnected`);
        
        socket.broadcast.emit("room.quit", { member: socket.id });
    });
});

module.exports = io;