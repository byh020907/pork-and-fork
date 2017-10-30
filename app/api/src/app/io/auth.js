const Account = require("../../model/account"); 

exports.login = async (socket, frame, ack) => {
    const { id, password } = frame;

    let account;

    try {
        account = await Account.findByIdAndPw({ id, password }).exec();
    } catch (e) {
        ack(false, new Error("Internal Server Error"));
        return console.error(e);
    }

    account.decrypt();

    ack(true);

    socket.user = account;
};

exports.register = async (socket, frame, ack) => {
    const { id, password, name } = frame;

    const result = Account.validate(frame);

    if (result.error) {
        return ack(false, new Error("Invaild Parameter"));
    }

    const account = new Account({ id, password, name });

    account.encrypt();

    try {
        await account.save();
    } catch (e) {
        ack(false, new Error("Internal Server Error"));
        return console.error(e);
    }
};