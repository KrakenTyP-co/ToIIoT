'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  wcIds: [String],
  deviceToken: String
});

module.exports = userSchema;