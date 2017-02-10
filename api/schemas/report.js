const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let reportSchema = new Schema({
    date: Date,
    status: Boolean
});

module.exports = reportSchema;