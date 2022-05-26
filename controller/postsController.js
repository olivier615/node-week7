const User = require('../models/userModel')
const Post = require('../models/postModel')
const handelSuccess = require('../service/handelResponse.js')
const appError = require('../service/appError.js')

exports.getAllPosts = async (req, res, next) => {
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {}
  const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
  const allPosts = await Post.find(q).populate({
    path: 'user',
    select: 'name photo'
  }).sort(timeSort)
  handelSuccess(res, allPosts)
}

exports.getPost = async (req, res, next) => {
  const {id} = req.params
  const post = await Post.find({
    _id: id
  }).populate({
    path: 'user',
    select: 'name photo'
  })
  handelSuccess(res, post)
}

exports.createPost = async (req, res, next) => {
  const data = req.body
  if (data.image !== '') {
    if (!data.image.startsWith('https')) {
      return next(appError(400, 'image 網址不正確', next))
    }
  }
  if (data.content === undefined || data.content === null || data.content.trim() === '') {
    return next(appError(400, 'content 未填寫', next))
  }
  const newPost = await Post.create({
    content: data.content,
    tags: data.tags,
    type: data.type,
    image: data.image,
    user: req.user.id
  })
  handelSuccess(res, newPost)
}

// exports.deleteAllPosts = async (req, res) => {
//   await Post.deleteMany({})
//   handelSuccess(res)
// }

exports.deletePost = async (req, res, next) => {
  const {id} = req.params
  const executor = req.user.id
  const poster = await Post.findOne({_id: id}).populate({
    path: 'user',
    select: 'id'
  })
  if (poster.user.id !== executor) {
    return next(appError(400, '無法刪除此貼文', next))
  }
  await Post.findByIdAndRemove(id)
  handelSuccess(res)
}

exports.updatePost = async (req, res, next) => {
  const { id } = req.params
  const data = req.body
  const executor = req.user.id
  const poster = await Post.findOne({_id: id}).populate({
    path: 'user',
    select: 'id'
  })
  if (poster.user.id !== executor) {
    return next(appError(400, '無法變更此貼文', next))
  }
  if (data.content === undefined || data.content === null || data.content.trim() === '') {
    return next(appError(400, 'content 未填寫', next))
  }
  if (data.image !== '' && !data.image.startsWith('https')) {
    return next(appError(400, 'image 網址不正確', next))
  }
  await Post.findByIdAndUpdate(id, data)
  const editPost = await Post.find({
    _id: id
  }).populate({
    path: 'user',
    select: 'name photo'
  })
  handelSuccess(res, editPost)
}

exports.like = async (req, res, next) => {
  const _id = req.params.id
  await Post.findOneAndUpdate(
    { _id},
    { $addToSet: { likes: req.user.id } }
  )
  res.status(201).json({
    status: 'success',
    postId: _id,
    userId: req.user.id
  })
}

exports.dislike = async (req, res, next) => {
  const _id = req.params.id
  await Post.findOneAndUpdate(
    { _id},
    { $pull: { likes: req.user.id } }
  )
  res.status(201).json({
    status: 'success',
    postId: _id,
    userId: req.user.id
  })
}

exports.getUserPosts = async (req, res, next) => {
  const user = req.params.id
  const posts = await Post.find({ user })
  res.status(200).send({
    status: 'success',
    result: posts.length,
    posts
  })
}