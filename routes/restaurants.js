const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

router.get('/', (req, res) => {
  const option = String(req.query.option)
  const orderOption = {
    byAtoZ: ['name', 'ASC'],
    byZtoA: ['name', 'DESC'],
    byCategory: ['category'],
    byRegion: ['location']
  }
  const orderBy = orderOption[option] || ['id', 'ASC']

  return Restaurant.findAll({
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true,
    order: [orderBy]
  })
    .then((restaurants) => {
      const keyWord = req.query.searchTerm
      const matchedRestaurants = keyWord
        ? restaurants.filter(function (restaurant) {
          return Object.values(restaurant).some((values) => {
            if (typeof (values) === 'string') {
              return values.toLowerCase().trim().includes(keyWord.toLowerCase().trim())
            }
            return false
          })
        })
        : restaurants
      res.render('index', { cssFile: '/stylesheets/index_style.css', restaurants: matchedRestaurants, keyWord, option })
    })
})
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const body = req.body
  body.rating = body.rating === '' ? 0 : body.rating // 將空字串轉為 0
  return Restaurant.create(body)
    .then(() => res.redirect('/restaurants'))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('show', { cssFile: '/stylesheets/show_style.css', restaurant })
    })
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('edit', { restaurant })
    })
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const body = req.body
  body.rating = body.rating === '' ? 0 : body.rating // 將空字串轉為 0
  console.log(body)
  return Restaurant.update(body, { where: { id } })
    .then(() => res.redirect(`/restaurants/${id}`))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => res.redirect('/restaurants'))
})

module.exports = router
