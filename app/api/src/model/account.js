const Joi = require("joi");
const Mongoose = require("../../lib/utility/mongoose");
const AES256 = require("../../lib/support/crypto/aes256");
const SHA256 = require("../../lib/support/crypto/sha256");

const { Schema } = Mongoose;

const Account = new Schema({
    id: { 
        type: String, 
        unique: true 
    },

    password: String,
    name: String
});

Account.statics.findByIdAndPw = function({ id, password }) {
    id = AES256.encrypt(id);
    password = SHA256.encrypt(password);

    return this.findOne({ id, password });
};

Account.statics.validate = function({ id, password, name }) {
    const validation = Joi.object().keys({
        id: Joi.string().required(),
        password: Joi.string().required(),
        name: Joi.string().required()
    });

    return Joi.validate({ id, password, name }, validation);
};

Account.methods.decrypt = function() {
    const { id, name } = this;

    this.id = AES256.decrypt(id);
    this.name = AES256.decrypt(name);
};

Account.methods.encrypt = function() {
    const { id, password, name } = this;

    this.id = AES256.encrypt(id);
    this.password = SHA256.encrypt(password);
    this.name = AES256.encrypt(name);
};

const account = Mongoose.model('Account', Account);
module.exports = account;