const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
const config = require('./config/')
const db = require('./src/models')
const auth = require('./src/auth')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(auth.initialize())
app.use(morgan(config.LOGGER_LEVEL))
app.use(cors())
app.use(compression())
app.use(require('./src/routes'))

app.listen(config.PORT, config.HOST, () => {
  console.log(`App listening: http://${config.HOST}:${config.PORT}`)
})
