const Joi = require("joi");
const Account = require("../../../model/account");

exports.signUp = async (ctx) => {
    let { id, password, name } = ctx.request.body; 

    const result = Account.validate(ctx.request.body);

    if (result.error) {
        ctx.throw(400, JSON.stringify({ reason: "Invaild parameter" }));
    }

    const account = new Account({ id, password, name });
    account.encrypt();

    try {
        await account.save();
    } catch (e) {
        const { reason } = e;
        ctx.throw(500, JSON.stringify({ reason }));
    }

    ctx.status = 201;
};

exports.signIn = async (ctx) => {
    const { id, password } = ctx.request.body;
    let account;

    try {
        account = await Account.findByIdAndPw({ id, password }).exec();
    } catch (e) {
        const { reason } = e;
        ctx.throw(500, JSON.stringify({ reason }));
    }

    if (!account) {
        ctx.throw(404, JSON.stringify({ reason: "Cannot Find Account" }));
    }

    ctx.status = 200;
};