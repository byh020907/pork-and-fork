const Log = require("../../support/log");

module.exports = () => {
    return async (packet, next) => {
        console.log(packet);
        await next();
    };
};