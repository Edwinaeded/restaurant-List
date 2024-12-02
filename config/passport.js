const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
  return User.findOne ({
    where: { email: username },
    attributes: ["id", "name", "email", "password"],
    raw: true
  })
  .then((user) => {
    if (user === null) {
      return done(null, false, { message: '此email找不到使用者:('})
    }
    if (user.password !== password) {
      return done(null, false, { message: '密碼錯誤:('})
    }
    return done(null, user)
  })
}))

passport.serializeUser((user, done) => {
  const { id, email, name } = user
  done(null, { id, email, name})
})

passport.deserializeUser((user, done) => {
  done(null, {id: user.id, email: user.email, name: user.name })
})

module.exports = passport
