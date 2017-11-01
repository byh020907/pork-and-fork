const Log = require("../../../lib/support/log");

exports.create = (socket, frame, ack) => {
    const { user } = socket;

    if (!user) {
        return ack(false, { reason: "Not Authorized" });
    }

    const { name } = frame;

    if (socket.rooms[name]) {
        return ack(false, { reason: "Duplicated Room Name" });
    }

    try {
        socket.join(name);
    } catch (e) {
        ack(false, { reason: e.message });
        Log("ERROR", `failed to create room because ${ e.message }`);

        return console.error(e);
    }

    socket.room = name;
    return ack(true);
};

exports.chat = (socket, frame, ack) => {
    const { user, room } = socket;

    if (!user) {
        return ack(false, { reason: "Not Autorized" });
    }

    if (!room) {
        return ack(false, { reason: "Cannot Find Current Room" });
    }

    try {
        socket.to(room).emit("room.chat", { 
            sender: socket.id, 
            message: frame.message 
        });
    } catch (e) {
        ack(false, { reason: e.message });
        Log("ERROR", `failed to send message because ${ e.message }`);

        return console.error(e);
    }

    return ack(true);
};