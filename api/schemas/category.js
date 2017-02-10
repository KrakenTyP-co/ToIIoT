const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema({
    id:  Number,
    title: String
});