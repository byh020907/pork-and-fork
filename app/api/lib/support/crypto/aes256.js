const Crypto = require("crypto");
const Config = require("../config");

const { crypto: { aes256: { secret } } } = Config;

exports.encrypt = (text) => {
    const cipher = Crypto.createCipher("aes-256-cbc", secret);
    let result = cipher.update(text, "utf-8", "hex");

    result += cipher.final("hex");
    return result;
};

exports.decrypt = (text) => {
    const deCipher = Crypto.createDecipher("aes-256-cbc", secret);
    let result = deCipher.update(text, "hex", "utf-8");

    result += deCipher.final("utf-8");
    return result;
};