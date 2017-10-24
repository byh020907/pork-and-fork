const Mongoose = require('../../lib/util/mongoose');
const { Schema } = Mongoose.Schema;

const Account = new Schema({
    id: String,
    password: String,
    name: String
});

const account = Mongoose.model('Account', account);
module.exports = account;