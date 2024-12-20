const express = require('express')
const { engine } = require('express-handlebars')

const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')

require('dotenv').config()

const passport = require('./config/passport')

const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')
const router = require('./routes')
const app = express()
const port = 3000

app.use(express.static('public'))
app.engine('.hbs', engine({
  extname: '.hbs',
  helpers: {
    eq: function (a, b) {
      return a === b
    }
  }
}))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'ThisIsSecret',
  resave: false,
  saveUnititialized: false
}))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

app.use(messageHandler)
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})

