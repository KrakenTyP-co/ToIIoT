'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var wcSchema = new Schema({
  categoryId: ObjectId,
  status: Boolean,
  active: Boolean,
  token: String,
  deviceTokens: [String],
  adminDeviceTokens: [String],
  banner: String,
  usageCount: Number,
  inactivity: Number
});

module.exports = mongoose.model('Wc', wcSchema);