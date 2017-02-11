'use strict';

var joi = require('joi');

module.exports = {
  validate: function validate(expSchemas) {
    return function (req, res, next) {
      var errors = Object.keys(expSchemas).reduce(function (acc, key) {
        var _joi$validate = joi.validate(req[key], expSchemas[key]),
            error = _joi$validate.error;

        if (error) {
          acc.push(error.details[0]);
        }
        return acc;
      }, []);
      if (errors.length > 0) {
        return res.status(400).json(errors);
      }
      next();
    };
  }
};