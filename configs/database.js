const joi = require('joi')

module.exports = {
  DB_HOST: joi.string().default('127.0.0.1'),
  DB_PORT: joi.string().default('27017')
}
