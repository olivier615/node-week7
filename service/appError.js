const appError = (httpStatus, errMessage, next) => {
  const error = new Error(errMessage)
  error.statusCode = httpStatus
  error.isOperational = true // 用於分辨是否為預期的錯誤
  next(error)
}

module.exports = appError