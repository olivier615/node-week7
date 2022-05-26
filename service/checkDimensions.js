const appError = require('../service/appError.js')
const sizeOf = require('image-size')
// 檢查圖片尺寸
const checkDimensions = (req, res, next) => {
  const dimensions = sizeOf(req.files[0].buffer)
  if (dimensions.width !== dimensions.height) {
    return next(appError(400, '圖片長寬不符合 1:1 尺寸', next))
  } else {
    next()
  }
}

module.exports = checkDimensions
