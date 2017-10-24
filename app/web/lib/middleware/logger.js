const Log = require("../support/log");

module.exports = () => {
    return async (ctx, next) => {
        const { method, path } = ctx.request;
        Log("REQUEST", `${ method } ${ path }`);

        await next();
    };
};