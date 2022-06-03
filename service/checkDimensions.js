const appError = require('../service/appError.js')
const sizeOf = require('image-size')
// 檢查圖片尺寸
const checkDimensions = (req, res, next) => {
  if (!req.files.length) {
    return next(appError(400, '未選擇檔案', next))
  }
  const q = req.query.type
  if (q === 'avatar') {
    const dimensions = sizeOf(req.files[0].buffer)
    if (dimensions.width !== dimensions.height) {
      return next(appError(400, '圖片長寬不符合 1:1 尺寸', next))
    }
  }
  next()
}

module.exports = checkDimensions
