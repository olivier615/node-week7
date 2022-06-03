const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const handleErrorAsync = require('../service/handleErrorAsync.js')
const appError = require('../service/appError')

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token
  if (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    // headers 的 authorization 開頭必須為 Bearer
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(appError(401,'尚未登入', next))
  }
  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token,
      process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          return next(appError(400, '認證失敗，請重新登入', next))
        } else {
          resolve(payload)
        }
      })
    })
    const currentUser = await User.findById(decoded.id)
    req.user = currentUser
    next()
})

module.exports = isAuth