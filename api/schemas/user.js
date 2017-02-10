const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    wcIds: [String],
    clientId: String
});

module.exports = userSchema;