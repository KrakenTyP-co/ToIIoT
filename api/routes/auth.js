const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const joi = require('joi')
const jwt = require("jsonwebtoken")
const config = require('../../config')
const models = require('../models')
const User = models.user
const { validate } = require('../helpers')

router.post('/',
  validate({
    body: joi.object({
      email: joi.string().email().required(),
      password: joi.string().required()
    }).required()
  }),
  async (req, res) => {
    try {
      const { email, password } = req.body
      const { notExpire } = req.query
      const user = await User.findOne({
        where: { email, is_active: true },
        attributes: [ 'id', 'email', 'first_name', 'last_name', 'password_digest']
      })
      if(!user || user.email !== email || !bcrypt.compareSync(password, user.password_digest)) {
        return res.sendStatus(401)
      }
      const { id, first_name, last_name } = user
      res.status(200).json({
        token: jwt.sign({ id }, config.JWT_SECRET, { expiresIn: notExpire ? '1y' : '30s' }),
        first_name: first_name,
        last_name: last_name
      })
    } catch (error) {
      console.error(error)
      res.sendStatus(401)
    }
  }
)

module.exports = router
