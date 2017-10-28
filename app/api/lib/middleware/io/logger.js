const Log = require("../../support/log");

module.exports = () => {
    return (packet, next) => {
        const [ event, frame ] = packet;

        Log("EVENT", `${ event } ${ JSON.stringify(frame) }`);
        next();
    };
};