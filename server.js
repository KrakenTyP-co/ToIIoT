require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')

import {Generator} from './api/generator/generator';
    // const auth = require('./src/auth')

const mongoose = require('mongoose');
let options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
}
options.server.socketOptions = { keepAlive: -1 };
mongoose.connect(`mongodb://${process.env.DB_HOST}/toiiot`, options);

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
    // app.use(auth.initialize())
app.use(morgan(process.env.LOGGER_LEVEL))
app.use(cors())
app.use(compression())
app.use(require('./api/routes'))

app.listen(process.env.PORT, process.env.HOST, () => {
    console.log(`App listening: http://${process.env.HOST}:${process.env.PORT}`)

});

new Generator();