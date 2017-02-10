require('dotenv').config()
const joi = require('joi')
const serverEnvSchema = require('./server')
const databaseEnvSchema = require('./database')

const { error, value: envVars } = joi.validate(
  process.env,
  joi.object({
    ...serverEnvSchema,
    ...databaseEnvSchema
  })
  .unknown()
  .required()
)
if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

module.exports = {
  ...envVars,
  database: {
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_DATABASE,
    host: envVars.DB_HOST,
    dialect: 'mysql'
  }
}
