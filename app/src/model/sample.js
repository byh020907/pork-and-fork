const Mongoose = require('../../lib/util/mongoose');
const { Schema } = Mongoose.Schema;

const Sample = new Schema({
    sample: String
});

const sample = Mongoose.model('Sample', sample);
module.exports = sample;