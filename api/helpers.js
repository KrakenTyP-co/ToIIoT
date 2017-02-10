const joi = require('joi')

module.exports = {
  validate: expSchemas => (req, res, next) => {
    const errors = Object.keys(expSchemas).reduce((acc, key) => {
      const { error } = joi.validate(req[key], expSchemas[key])
      if(error) {
        acc.push(error.details[0])
      }
      return acc
    }, [])
    if(errors.length > 0) {
      return res.status(400).json(errors)
    }
    next()
  }
}
