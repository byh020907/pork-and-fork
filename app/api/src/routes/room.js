module.exports = (socket) => { 
    socket.on("room.create", (frame, ack) => {
        let { id, server } = socket;
        let { rooms } = server.sockets.adapter;
        let { name } = frame;
    
        if (rooms[name]) {
            return ack(false, { reason: "Duplicated Room Name" });
        }
    
        try {
            socket.join(name);
            socket.to(name).emit("room.join", {
                member: id
            });
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
        
        let room = rooms[name];
        room.name = name;
        room.master = socket.id;
    
        socket.room = room;
        return ack(true);
    });

    socket.on("room.list", (frame, ack) => {
        let { server } = socket;
        let { rooms } = server.sockets.adapter;
    
        Object
            .keys(rooms)
            .filter(name => !rooms[name].hasOwnProperty("master"))
            .forEach(name => delete rooms[name])

        let mapped = {};

        Object
            .keys(rooms)    
            .forEach(name => {
                let { length } = rooms[name];
                mapped[name] = { length };
            });

        return ack(true, mapped);
    });

    socket.on("room.join", (frame, ack) => {
        let { id, server } = socket;
        let { sockets } = server.sockets;
        let { rooms } = server.sockets.adapter;
        let { name } = frame;
    
        let room = rooms[name];

        if (!room) {
            return ack(false, { reason: "Cannot Find Room" });
        }

        try {
            socket.join(name);
            socket.to(name).emit("room.join", {
                member: id
            });
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }

        let mapped = {};

        Object
            .keys(sockets)
            .forEach(id => {
                let { user } = sockets[id];

                mapped[id] = { 
                    user: {
                        id: user.id,
                        name: user.name
                    },
                    
                    isMaster: id === room.master
                };
            });

        socket.room = room;
        return ack(true, mapped);
    });

    socket.on("room.quit", (frame, ack) => {
        let { id, room } = socket;
        
        try {
            socket.leave(room.name);
            socket.to(room.name).emit("room.quit", {
                member: id
            });
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
        
        socket.room = null;
        return ack(true, null);
    });

    socket.on("room.chat", (frame, ack) => {
        let { id, room } = socket;
        let { message } = frame;
    
        try {
            socket.to(room.name).emit("room.chat", {
                message: message,
                sender: id
            });
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
        
        return ack(true, null);
    });
};