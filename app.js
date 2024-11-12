const express = require("express")
const { engine } = require("express-handlebars")
//const restaurants = require("./public/jsons/restaurant.json").results
const app = express()
const port = 3000

const db = require("./models")
const Restaurant = db.Restaurant

app.use(express.static("public"))
app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended:true }));

app.get( "/" , (req, res) => {
  res.send("hello world")
})

app.get( "/restaurants" , (req, res) => {
  return Restaurant.findAll({
    attributes: ["id","name","name_en","category","image","location","phone","google_map","rating","description"],
    raw: true
  })
    .then((restaurants) => {
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
})

app.get( "/restaurant/:id" , (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id , {
    attributes: ["id", "name", "name_en", "category", "image", "location", "phone", "google_map", "rating", "description"],
    raw: true
  })
    .then((restaurant) => {
      res.render("show", { cssFile: "/stylesheets/show_style.css" , restaurant})
    })
})

app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

app.post("/restaurant", (req, res) => {
  const body = req.body
  body.rating = body.rating === "" ? 0 : body.rating  // 將空字串轉為 0
  console.log(body)
  return Restaurant.create(body)
    .then(() => res.redirect("/restaurants"))
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

