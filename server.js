require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const compression = require('compression')
// const auth = require('./src/auth')

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
})
