'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
    title: String
});

module.exports = mongoose.model('Category', categorySchema);