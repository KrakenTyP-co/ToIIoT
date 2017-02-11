const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let reportSchema = new Schema({
    date: Date,
    status: Boolean,
    wcId: ObjectId,
});

module.exports = mongoose.model('Report', reportSchema);;