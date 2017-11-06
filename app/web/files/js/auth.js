const Auth = {
    login: (socket, id, password, callback) => {
        socket.emit("auth.login", { id, password }, callback);
    },

    register: (socket, id, password, name, callback) => {
        socket.emit("auth.register", { id, password, name }, callback);
    }
}