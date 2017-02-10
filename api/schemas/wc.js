const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let wcSchema = new Schema({
    categoryId: Number,
    status: Boolean,
    active: Boolean
});