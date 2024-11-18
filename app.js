const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const router = require('./routes')
// const restaurants = require("./public/jsons/restaurant.json").results
const app = express()
const port = 3000

app.use(express.static('public'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(router)

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
