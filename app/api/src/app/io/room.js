exports.chat = (socket, frame, ack) => {
    try {
        socket.broadcast.emit("room.chat", { 
            sender: socket.id, 
            message: frame.message 
        });
    } catch (e) {
        ack(false, new Error("Internal Server Error"));
        return console.error(e);
    }

    ack(true);
};