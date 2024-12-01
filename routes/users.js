const express = require('express')
const router = express.Router()

router.post('/users', (req, res) => {
  res.send('A user has been registered!')
})

 module.exports = router