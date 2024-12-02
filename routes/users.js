const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

router.post('/', (req, res, next) => {
  const {name, email, password, passwordConfirm} = req.body

  if (!email.trim() || !password.trim() || !passwordConfirm.trim()) {
    req.flash('error', '必填欄位未填寫:(')
    return res.redirect('back')
  }
  if (password !== passwordConfirm) {
    req.flash('error', '驗證密碼與密碼不符:(')
    return res.redirect('back')
  }
  User.findOne({ where: { email }})
  .then((user) => {
    if ( user !== null ) {
      req.flash('error', '此email已被註冊:(')
      return res.redirect('back')
    }
    // 將使用者密碼雜湊處理
    return bcrypt.hash(password, 10)
  })
  .then((hash) => {
    return User.create({ name, email, password: hash })
  })
  .then(() => {
    req.flash('success', '註冊成功:) 請登入')
    return res.redirect('/login')
  })
  .catch((error) => {
    errorMessage = '註冊失敗:('
    next(error)
  })
})

 module.exports = router