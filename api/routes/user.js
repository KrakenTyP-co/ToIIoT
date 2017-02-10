const express = require('express')
const router = express.Router()
const joi = require('joi')
const { user, company } = require('../models')
const { validate } = require('../helpers')

router.get('/', (req, res) => {
  user.scope('full').findAll()
    .then(users => res.status(200).json(users))
})

router.get('/:userId', (req, res) => {
  const { userId } = req.params
  user.scope('full').findById(userId)
    .then(users => {
      if(!users) {
        return res.sendStatus(404)
      }
      return res.status(200).json(users)
    })
})

const expSchema = joi.object({
  email: joi.string().email().required(),
  first_name: joi.string().required(),
  last_name: joi.string().required(),
  phone: joi.string().required(),
  language_id: joi.string().required()
}).required()

router.post('/', validate('body', expSchema), (req, res) => {
  user.create(req.body)
    .then(user => res.status(201).json(user))
    .catch(error => res.status(400).json(error))
})

module.exports = router
