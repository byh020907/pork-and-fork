const Mongoose = require("mongoose");
const Log = require("../support/log");
const Config = require("../support/config");

Mongoose.Promise = global.Promise;

const connect = async (mongoose, path, option) => {
    try {
        await Mongoose.connect(`mongodb://${ path }`, option);
    } catch (e) {
        return Log("ERROR", `failed to connect mongo ${ JSON.stringify({ reason: e.message }) }`);
    }

    Log("INFO", `connected mongo at ${ path }`);
};

const { path } = Config.db.mongo;
const useMongoClient = true;

connect(Mongoose, path, { useMongoClient });

module.exports = Mongoose;