const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let wcSchema = new Schema({
    categoryId: String,
    status: Boolean,
    active: Boolean,
    token: String,
    banner: String
});