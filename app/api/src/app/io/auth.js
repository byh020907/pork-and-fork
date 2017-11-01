const Account = require("../../model/account"); 
const Log = require("../../../lib/support/log");

exports.login = async (socket, frame, ack) => {
    const { id, password } = frame;

    let account;

    try {
        account = await Account.findByIdAndPw({ id, password }).exec();
    } catch (e) {
        ack(false, { reason: "Internal Server Error" });
        Log("ERROR", `failed to find account because ${ e.reason }`);
        
        return console.error(e);
    }

    if (!account) {
        return ack(false, { reason: "Cannot Find Account" });
    }

    ack(true);

    account.decrypt();

    socket.user = account;
};

exports.register = async (socket, frame, ack) => {
    const { id, password, name } = frame;

    const result = Account.validate(frame);

    if (result.error) {
        return ack(false, { reason: "Invalid Parameter" });
    }

    const account = new Account({ id, password, name });

    account.encrypt();

    try {
        await account.save();
    } catch (e) {
        ack(false, { reason: e.message });
        Log("ERROR", `failed to save account because ${ e.message }`);

        return console.error(e);
    }

    ack(true);
};