require('dotenv').config()
require("babel-core/register")
require("babel-polyfill")
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
import { Generator } from './generator/generator'
const mongoose = require('mongoose')

let options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
}
options.server.socketOptions = { keepAlive: -1 };
mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/toiiot`, options);
mongoose.Promise = global.Promise

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
    // app.use(auth.initialize())
app.use(morgan(process.env.LOGGER_LEVEL))
app.use(cors())
app.use(compression())
app.use(require('./routes'))

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`App listening: http://${process.env.HOST}:${process.env.PORT}`)

});

app.get('*', function(req, res) {
    res.status(404).send({
        status: "error",
        message: "These are not the droids you looking for"
    });
});

new Generator('589e54647ebfb8f213a98f93');
new Generator('589e54747ebfb8f213a98faa');
new Generator('589e96507ebfb8f213a9bcd6');
new Generator('589e96667ebfb8f213a9bcf4');
new Generator('589e967e7ebfb8f213a9bd0a');
new Generator('589e96987ebfb8f213a9bd29');