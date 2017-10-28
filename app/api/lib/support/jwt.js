const JWT = require("jsonwebtoken");
const Config = require("./config");

const { secret } = Config.auth.jwt;

exports.encode = (data) => {
    const action = (resolve, reject) => {
        JWT.sign(data, secret, { expiresIn: "7d" }, (error, token) => {
            if (error) {
                reject(error);
            } else {
                resolve(token);
            }
        });
    };

    const callback = new Promise(action);
    return callback;
};

exports.decode = (token) => {
    const action = (resolve, reject) => {
        JWT.verify(token, secret, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    };

    const callback = new Promise(action);
    return callback;
};