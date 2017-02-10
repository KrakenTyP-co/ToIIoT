const joi = require('joi')

module.exports = {
  NODE_ENV: joi.string().allow(['development', 'production', 'test']).required(),
  HOST: joi.string().default('127.0.0.1'),
  PORT: joi.number().deafult('3000'),
  LOGGER_LEVEL: joi.string().allow(['dev', 'combined', 'common', 'short', 'tiny']).default('combined'),
  JWT_SECRET: joi.string().default('hd7o8agdo87b2kjlabdiuglasgd')
}
