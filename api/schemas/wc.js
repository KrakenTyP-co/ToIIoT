const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let wcSchema = new Schema({
  categoryId: ObjectId,
  status: Boolean,
  active: Boolean,
  title: String,
  token: String,
  deviceTokens: [String],
  adminDeviceTokens: [String],
  banner: String,
  usageCount: Number,
  inactivity: Number
});

module.exports = mongoose.model('Wc', wcSchema);
