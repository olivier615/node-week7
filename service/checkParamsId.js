const Post = require('../models/postModel')
const appError = require('./appError.js')
const mongoose = require('mongoose')

const checkParamsId = async (req, res, next) => {
  const {id} = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return appError(404, '參數 id 有誤', next)
  }
  next()
}

module.exports = checkParamsId
