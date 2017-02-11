const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
  wcIds: [String],
  deviceToken: String
});

module.exports = userSchema;
