"use strict";

var _generator = require("./generator/generator");

require('dotenv').config();
require("babel-core/register");
require("babel-polyfill");
var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');

// const auth = require('./src/auth')

var mongoose = require('mongoose');
var options = {
    db: { native_parser: true },
    server: { poolSize: 5 }
};
options.server.socketOptions = { keepAlive: -1 };
mongoose.connect("mongodb://" + process.env.DB_HOST + "/toiiot", options);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(auth.initialize())
app.use(morgan(process.env.LOGGER_LEVEL));
app.use(cors());
app.use(compression());
app.use(require('./routes'));

app.listen(process.env.PORT, process.env.HOST, function () {
    console.log("App listening: http://" + process.env.HOST + ":" + process.env.PORT);
});

new _generator.Generator();