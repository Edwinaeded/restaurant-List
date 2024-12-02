const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/restaurants',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }
    res.redirect('/login')
  })
})

module.exports = router