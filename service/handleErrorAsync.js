const handleErrorAsync = function handleErrorAsync(func) {
  // 將整個 controller 函式當作參數代數
  // 再執行函式，讓參數 func 具有 .catch
  return function (req, res, next) {
    func(req, res, next).catch(
      function (error) {
        return next(error)
      }
    )
  }
}

module.exports = handleErrorAsync