const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')

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
    return bcrypt.compare(password, user.password)
      .then((isMatched) => {
        if (!isMatched) {
          return done(null, false, { message: '密碼錯誤:(' })
        }
        return done(null, user)
      })
  })  
  .catch((error) => {
    errorMessage = '登入失敗:('
    done(error)
  })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/oauth2/facebook/redirect',
  profileFields: ['email', 'displayName']
},(accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value
  const name = profile.displayName

  return User.findOne({
    where: { email },
    attributes: ['id', 'name', 'email'],
    raw: true
  })
  .then((user) => {
    if (user) {
      return done(null, user)
    }

    const randomPsw = Math.random.toString(36).slice(-8)
    return bcrypt.hash(randomPsw, 10)
    .then((hash) => {
      return User.create({ name, email, password: hash})
    })
    .then((user) => {
      return done(null, user)
    })
    .catch((error) => {
      done(error)
    })
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
