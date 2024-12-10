const express = require('express')
const router = express.Router()

const root = require('./root')
const restaurants = require('./restaurants')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')

router.use('/', root)
router.use('/restaurants', authHandler, restaurants)
router.use('/users', users)
router.use('/', (req, res) => {
  res.redirect('/login')
})

module.exports = router
