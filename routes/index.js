const express = require('express')
const router = express.Router()

const root = require('./root')
const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.get('/', (req, res) => {
  res.send('hello world')
})

router.use('/', root)
router.use('/restaurants', authHandler, restaurants)
router.use('/users', users)

module.exports = router
