const User = require('../models/userModel')
const Post = require('../models/postModel')
const handelSuccess = require('../service/handelResponse.js')
const generateSendJWT = require('../service/generateSendJWT.js')
const appError = require('../service/appError.js')
const validator = require('validator')
const bcrypt = require('bcryptjs')

exports.checkUser = async (req, res, next) => {
  res.status(200).send({
    status: 'success',
    message: '登入狀態正常'
  })
}

exports.userSign_up = async (req, res, next) => {
  let { email, password, confirmPassword, name } = req.body
  if (!email || !password || !confirmPassword || !name) {
    return next(appError('400', '欄位未填寫正確', next))
  }
  if (!validator.isLength(name.trim(), { min: 2, max: 16 })) {
    return next(appError('400', '暱稱需要 2-16 個字元', next))
  }
  if (!validator.isEmail(email)) {
    return next(appError('400', 'email 格式不正確', next))
  }
  const checkEmail = await User.findOne({email})
  if (checkEmail) {
    return next(appError('400', '此 email 已註冊', next))
  }
  if (password !== confirmPassword) {
    return next(appError('400', '密碼不一致', next))
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(appError('400', '密碼不能少於 8 碼', next))
  }
  password = await bcrypt.hash(password, 12)
  const newUser = await User.create({
    email,
    password,
    name
  })
  generateSendJWT(newUser, 201, res)
}

exports.userSign_in = async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(appError('400', '帳號密碼不能為空', next))
  }
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(appError('400', '帳號或密碼錯誤', next))
  }
  const auth = await bcrypt.compare(password, user.password)
  if (!auth) {
    return next(appError('400', '帳號或密碼錯誤', next))
  }
  generateSendJWT(user, 201, res)
}

exports.userProfile = async (req, res, next) => {
  const { id } = req.user
  const user = await User.findById(id)
  .select('+email')
  handelSuccess(res, user)
}

exports.updatePassword = async (req, res, next) => {
  let { password, confirmPassword } = req.body
  if (password !== confirmPassword) {
    return next(appError('400', '密碼不一致', next))
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(appError('400', '密碼不能少於 8 碼', next))
  }
  const { id } = req.user
  const newPassword = await bcrypt.hash(password, 12)
  const editPassword = await User.findByIdAndUpdate(id, {
    password: newPassword
  })
  generateSendJWT(editPassword, 201, res)
  // 使用 generateSendJWT 將加密過的密碼混入環境變數，並回傳新的 token
}

exports.updateProfile = async (req, res, next) => {
  const { name, photo, gender } = req.body
  if (!validator.isLength(name.trim(), { min: 2, max: 16 })) {
    return next(appError(400, 'name 需要 2-16 個字元', next))
  }
  if (photo && !validator.isURL(photo, { protocols: ['https'] })){
    return next(appError(400, 'image 網址不正確', next))
  }
  if (!['male', 'female'].includes(gender)) {
    return next(appError(400, 'gender 字串內容只接受 male 或 female', next))
  }
  await User.findByIdAndUpdate(req.user.id, {
    name,
    gender,
    photo
  })
  const editProfile = await User.findById(req.user.id)
  handelSuccess(res, editProfile)
}

exports.getLikeList = async (req, res, next) => {
  const likeList = await Post.find({
    likes: { $in: [req.user.id] }
  }).populate({
    path: 'user',
    select: 'name _id'
  })
  res.status(200).send({
    status: 'success',
    likeList
  })
}

exports.followAnUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    return next(appError(401, '不要追蹤自己辣', next))
  }
  await User.updateOne(
    {
      _id: req.user.id,
      'following.user': {
        $ne: req.params.id
      }
    },
    {
      $addToSet: {
        following: {
          user: req.params.id
        }
      }
    }
  )
  await User.updateOne(
    {
      _id: req.params.id,
      'followers.user': {
        $ne: req.user.id
      }
    },
    {
      $addToSet: {
        followers: {
          user: req.user.id
        }
      }
    }
  )
  res.status(200).json({
    status: 'success',
    message: '已加入追蹤'
  })
}

exports.unFollowAnUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    return next(appError(401, '何必取消追蹤自己呢?', next))
  }
  await User.updateOne(
    {
      _id: req.user.id
    },
    {
      $pull: {
        following: {
          user: req.params.id
        }
      }
    }
  )
  await User.updateOne(
    {
      _id: req.params.id
    },
    {
      $pull: {
        followers: {
          user: req.user.id
        }
      }
    }
  )
  res.status(200).json({
    status: 'success',
    message: '已取消追蹤'
  })
}