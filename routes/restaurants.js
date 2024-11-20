const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

router.get('/', (req, res, next) => {
  // dropdown menu
  const option = req.query.option || 'None'
  const orderOption = {
    byAtoZ: ['name', 'ASC'],
    byZtoA: ['name', 'DESC'],
    byCategory: ['category'],
    byRegion: ['location']
  }
  const orderBy = orderOption[option] || ['id', 'ASC']
  
  // 分頁器
  const page = parseInt(req.query.page) || 1
  const limit = 9

  return Restaurant.findAll({
    limit ,
    offset : (page - 1) * limit ,
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
      res.render('index', {
        cssFile: '/stylesheets/index_style.css',
        restaurants: matchedRestaurants,
        keyWord,
        option,
        page,
        prev: page > 1 ? page - 1 : 1,
        next: page + 1
      })
    })
    .catch((error) => {
      errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res, next) => {
  const body = req.body
  body.rating = body.rating === '' ? 0 : body.rating // 將空字串轉為 0
  return Restaurant.create(body)
    .then(() => {
      req.flash('success', '新增成功!')
      return res.redirect('/restaurants')
    })
    .catch((error) => {
      errorMessage = '新增失敗:('
      next(error)
    })
})

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('show', { cssFile: '/stylesheets/show_style.css', restaurant })
    })
    .catch((error) => {
      errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => {
      res.render('edit', { restaurant })
    })
    .catch((error) => {
      errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  body.rating = body.rating === '' ? 0 : body.rating // 將空字串轉為 0
  console.log(body)
  return Restaurant.update(body, { where: { id } })
    .then(() => {
      req.flash('success', '更新成功!')
      return res.redirect(`/restaurants/${id}`)
    })
    .catch((error) => {
      errorMessage = '更新失敗:('
      next(error)
    })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  return Restaurant.destroy({ where: { id } })
    .then(() => {
      req.flash('success', '刪除成功!')
      return res.redirect('/restaurants')
    })
    .catch((error) => {
      errorMessage = '刪除失敗:('
      next(error)
    })
})

module.exports = router
