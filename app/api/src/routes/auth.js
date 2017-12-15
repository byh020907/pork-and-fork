const Account = require("../model/account");

module.exports = (socket) => {
    socket.on("auth.login", async (frame, ack) => {
        let { server } = socket;
        let { sockets } = server.sockets;
        let { id, password } = frame;
    
        let account;

        try {
            account = await Account.findByIdAndPw({ id, password });
        } catch (e) {
            ack(false, { reason: "Internal Server Error" });
            return console.error(e);
        }
    
        if (!account) {
            return ack(false, { reason: "Cannot Find Account" });
        }
        
        account.decrypt();
        
        // 현 접속 유저 중 동일한 계정의 유저 탐색
        Object
            .keys(sockets)
            .filter(id => sockets[id].hasOwnProperty("user"))
            .forEach(id => { 
                if (sockets[id].user.id === account.id) {
                    return ack(false, { reason: 'Already Connected Now' });
                }
            });
    
        socket.user = account;
        socket.join("lobby");
    
        return ack(true);
    });

    socket.on("auth.register", async (frame, ack) => {     
        let result = Account.validate(frame);
        
        if (result.error) {
            return ack(false, { reason: "Invalid Parameter" });
        }
        
        let { id, password, name } = frame;
        
        let account = new Account({ id, password, name });
        account.encrypt();
        
        try {
            await account.save();
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
        
        ack(true);
    });

    socket.on("auth.check", async (frame, ack) => {
        let { id } = frame;
        let account;
        
        try {
            account = await Account.findById({ id }).exec();
        } catch (e) {
            ack(false, { reason: e.message });
            return console.error(e);
        }
        
        if (account) {
            return ack(false, { reason: "Account Already Exists" });
        }
        
        return ack(true);
    });
};