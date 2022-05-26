const Post = require('../models/postModel')
const appError = require('../service/appError.js')

const checkPostId = async (req, res, next) => {
  const {id} = req.params
  if (id === undefined || id === null || id.trim() === '') {
    return appError(404, '請輸入貼文 id', next)
  }
  const hasCapital = (str) => {
    const result = str.match(/^.*[^0-9a-z]+.*$/)
    // 檢查發文者 id 是否包含大寫或其他符號
    if (result === null) {
      return true
    } else {
      return false
    }
  }
  if (id.length === 24 && hasCapital(id)) {
    const result = await Post.findById(id)
    if (result !== null) {
      next()
    } else {
      return next(appError(400, '此 id 找不到貼文', next))
    }
  } else {
    return next(appError(400, '貼文 id 不正確', next))
  }
}

module.exports = checkPostId
