const express = require("express")
const { engine } = require("express-handlebars")
const restaurants = require("./public/jsons/restaurant.json").results
const app = express()
const port = 3000

app.use(express.static("public"))
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.get( "/" , (req, res) => {
  res.redirect("/restaurants")
})

app.get( "/restaurants" , (req, res) => {
  const keyWord = req.query.searchTerm
  const matchedRestaurants = keyWord? restaurants.filter(function(restaurant){
    return Object.values(restaurant).some((values) => {
      if (typeof(values) === 'string' ){
        return values.toLowerCase().trim().includes(keyWord.toLowerCase().trim())
      }
      return false
    })
  }) : restaurants
  res.render("index" , { cssFile : "/stylesheets/index_style.css" , restaurants : matchedRestaurants , keyWord })
})

app.get( "/restaurant/:id" , (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id )
  res.render("show", { cssFile: "/stylesheets/show_style.css" , restaurant})
})

app.get("/restaurants/new", (req, res) => {
  res.send("create new restaurant page")
})

app.post("/restaurant", (req, res) => {
  res.send("A restaurant been created")
})

app.get("/restaurant/:id/edit", (req, res) => {
  res.send("edit restaurant detail page")
})

app.put("/restaurant/:id", (req, res) => {
  res.send("A restaurant been edited")
})

app.delete("/restaurant/:id", (req, res) => {
  res.send("A restaurant been deleted")
})

app.listen(port , () => {
  console.log ( `express server is running on http://localhost:${port}`)
})

