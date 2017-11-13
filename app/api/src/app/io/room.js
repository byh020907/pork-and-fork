const Log = require("../../../lib/support/log");

exports.create = (socket, frame, ack) => {
    const { user, io } = socket;
    const { rooms } = io.sockets.adapter;
    const { name } = frame;

    if (!user) {
        return ack(false, { reason: "Not Authorized" });
    }

    if (rooms[name]) {
        return ack(false, { reason: "Duplicated Room Name" });
    }

    try {
        socket.join(name);
    } catch (e) {
        ack(false, { reason: e.message });
        Log("ERROR", `failed to create room because ${ name }`);
        
        return console.error(e);
    }
    
    const room = rooms[name];

    room.name = name;
    room.master = socket.user.id;

    socket.room = room;

    return ack(true, null);
};

exports.list = (socket, ack) => {
    const { user, io } = socket;
    const { rooms } = io.sockets.adapter;

    if (!user) {
        return ack(false, { reason: "Not Authorized" });
    }

    Object
        .keys(rooms)
        .filter(name => !rooms[name].hasOwnProperty("master"))
        .forEach(name => delete rooms[name]);

    return ack(true, null, rooms);
};

exports.join = (socket, frame, ack) => {
    const { user, io } = socket;
    const { rooms } = io.sockets.adapter;
    const { name } = frame;

    if (!user) {
        return ack(false, { reason: "Not Authorized" });
    }
    
    const room = rooms[name];

    if (!room) { 
        return ack(false, { reason: `Cannot Found Room ${ name }` });
    }

    try {
        socket.join(name);

        socket.to(name).emit("room.join", {
            member: user.id
        });
    } catch (e) {
        ack(false, { reason: e.message });
        Log("ERROR", `failed to join room because ${ e.message }`);
        
        return console.error(e);
    }

    socket.room = room;

    return ack(true, null);
};

exports.quit = (socket, ack) => {
    const { user, room } = socket;

    if (!user) {
        return ack(false, { reason: "Not Authorized" });
    }

    if (!room) {
        return ack(false, { reason: "Cannot Found Current Room" });
    }

    try {
        socket.leave(room.name);

        socket.to(room.name).emit("room.quit", {
            member: user.id
        });
    } catch (e) {
        ack(false, { reason: e.message });
        Log("ERROR", `failed to quit room because ${ e.message }`);

        return console.error(e);
    }

    socket.room = false;

    return ack(true, null);
};

exports.chat = (socket, frame, ack) => {
    const { user, room } = socket;
    const { message } = frame;

    if (!user) {
        return ack(false, { reason: "Not Authorized" });
    }

    if (!room) {
        return ack(false, { reason: "Cannot Found Current Room" });
    }

    try {
        socket.to(room.name).emit("room.chat", {
            message: message,
            sender: user.id
        });
    } catch (e) {
        ack(false, { reason: e.message });
        Log("ERROR", `failed to chat message because ${ e.message }`);

        return console.error(e);
    }
    
    return ack(true, null);
}