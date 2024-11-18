const express = require('express')
const router = express.Router()

const restaurants = require('./restaurants')

router.get('/', (req, res) => {
  res.send('hello world')
})

router.use('/restaurants', restaurants)

module.exports = router
