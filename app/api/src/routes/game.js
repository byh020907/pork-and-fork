module.exports = (socket) => {
    socket.on("game.start", async (frame, ack) => {
        let { room, user } = socket;
        
        if (socket.id === room.master.id) {
            return ack(false, { reason: "Player Isn't Owner" });
        }

        try {
            socket.to(room.name).emit("game.play");
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
        
        return ack(true);
    });

    socket.on("game.move", async (frame, ack) => {
        let { room, user } = socket;
        let { direction } = frame;
        
        try {
            socket.to(room.name).emit("game.move", {
                sender: socket,
                direction
            });
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
    
        return ack(true);
    });

    socket.on("game.jump", async (frame, ack) => {
    });

    socket.on("game.sync", async (frame, ack) => {
        let { room, user } = socket;
        let { x, y } = frame;
        
        try {
            socket.to("game.sync", {
                sender: socket,
                location: { x, y } 
            });
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
    
        return ack(true);
    });
};