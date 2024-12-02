const express = require('express')
const router = express.Router()

const db = require('../models')
const Restaurant = db.Restaurant

router.get('/', (req, res, next) => {
  const { name , id } = req.user
  console.log(req.user)
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
    where: { userId: id },
    limit ,
    offset : (page - 1) * limit ,
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
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
  let { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const userId = req.user.id
  rating = rating === '' ? 0 : rating // 將空字串轉為 0
  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description, userId })
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
  const userId = req.user.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料:(')
        return res.redirect(req.get('Referer') || '/restaurants')
      }
      if (restaurant.userId !== userId) {
        req.flash('error', '權限不足:(')
        return res.redirect(req.get('Referer') || '/restaurants')
      }
      res.render('show', { cssFile: '/stylesheets/show_style.css', restaurant })
    })
    .catch((error) => {
      errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId'],
    raw: true
  })
    .then((restaurant) => {
      if (!restaurant) {
        req.flash('error', '找不到資料:(')
        return res.redirect('/restaurants')
      }
      if (restaurant.userId !== userId) {
        req.flash('error', '權限不足:(')
        return res.redirect('/restaurants')
      }
      res.render('edit', { restaurant })
    })
    .catch((error) => {
      errorMessage = '資料取得失敗:('
      next(error)
    })
})

router.put('/:id', (req, res, next) => {
  const id = req.params.id
  let { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
  const userId = req.user.id

  rating = rating === '' ? 0 : rating // 將空字串轉為 0
  return Restaurant.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description', 'userId']
  })
  .then((restaurant) => {
    if (!restaurant) {
      req.flash('error', '找不到資料:(')
      return res.redirect('/restaurants')
    }
    if (restaurant.userId !== userId) {
      req.flash('error', '權限不足:(')
      return res.redirect('/restaurants')
    }
    return restaurant.update({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => {
      req.flash('success', '更新成功!')
      return res.redirect(`/restaurants/${id}`)
    })
  })
  .catch((error) => {
    errorMessage = '更新失敗:('
    next(error)
  })
})

router.delete('/:id', (req, res, next) => {
  const id = req.params.id
  const userId = req.user.id

  return Restaurant.findByPk (id, {
    attributes: ['id','userId']
  })
  .then((restaurant) => {
    if (!restaurant) {
      req.flash('error', '找不到資料:(')
      return res.redirect('/restaurants')
    }
    if (restaurant.userId !== userId) {
      req.flash('error', '權限不足:(')
      return res.redirect('/restaurants')
    }
    return restaurant.destroy()
    .then(() => {
      req.flash('success', '刪除成功!')
      return res.redirect('/restaurants')
    })
  })
  .catch((error) => {
    errorMessage = '刪除失敗:('
    next(error)
  })
})

module.exports = router
