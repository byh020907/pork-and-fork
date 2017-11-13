const Crypto = require("crypto");
const Config = require("../config");

const { secret } = Config.crypto.sha256;

exports.encrypt = (text) => {
    let result = Crypto.createHmac("sha256", secret).update(text).digest("hex");
    return result; 
};