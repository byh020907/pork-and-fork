const Log = require("../support/log");

module.exports = () => {
    return (packet, next) => {
        const [ event, param ] = packet;
        
        Log("EVENT", `${ event } ${ JSON.stringify(param) }`);
    
        return next();
    };
}
