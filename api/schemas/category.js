const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    title: String
});

module.exports = mongoose.model('Category', categorySchema);