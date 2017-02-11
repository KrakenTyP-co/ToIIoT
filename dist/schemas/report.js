'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var reportSchema = new Schema({
    date: { type: Date, default: Date.now },
    status: Boolean,
    wcId: ObjectId
});

module.exports = mongoose.model('Report', reportSchema);;