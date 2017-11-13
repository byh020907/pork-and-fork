const Room = {
    create: (socket, name, callback) => {
        socket.emit("room.create", { name }, callback);
    },

    list: (socket, callback) => {
        socket.emit("room.list", null, callback)
    },

    join: (socket, name, callback) => {
        socket.emit("room.join", { name }, callback);
    },

    quit: (socket, callback) => {
        socket.emit("room.quit", null, callback);
    },

    chat: (socket, message, callback) => {
        socket.emit("room.chat", { message }, callback);
    }
};