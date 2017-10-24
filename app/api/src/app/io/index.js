const Socket = require("socket.io");
const Log = require("../../../lib/support/log");
const Logger = require("../../../lib/middleware/io/logger");

const io = Socket();

io.on("connection", (socket) => {
    Log("INFO", `a new socket ${ socket.id } connected`);

    socket.use()

    socket.on("disconnect", () => {
        Log("INFO", `a socket ${ socket.id } disconnected`);
    });
});

module.exports = io;