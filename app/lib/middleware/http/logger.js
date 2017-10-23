const Log = require("../../support/log");

module.exports = () => {
    return async (ctx, next) => {
        const { method, path, body } = ctx.request;
        Log("REQUEST", `${ method } ${ path } ${ JSON.stringify(body) }`);

        await next();
    };
};