const Crypto = require("crypto");
const Config = require("../config");

const { crypto: { sha256: { secret } } } = Config;

exports.encrypt = (text) => {
    Crypto.createHmac("sha256", secret).update(text).digest("hex");
    return text; 
};