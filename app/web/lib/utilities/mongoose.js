const Mongoose = require("mongoose");
const Log = require("../support/log");
const Config = require("../support/config");

Mongoose.Promise = global.Promise;

const connect = async (mongoose, path, option) => {
    try {
        await Mongoose.connect(`mongodb://${ path }`, option);
    } catch (e) {
        return log("ERROR", `failed to connect mongo ${{ reason: e.message }}`);
    }

    Log("INFO", `connected mongo at ${ path }`);
};

const { db: { mongo: { path } } } = Config;
const useMongoClient = true;

connect(Mongoose, path, { useMongoClient });

module.exports = Mongoose;