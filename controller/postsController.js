const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentsModel')
const handelSuccess = require('../service/handelResponse.js')
const appError = require('../service/appError.js')
const validator = require('validator')

exports.getAllPosts = async (req, res, next) => {
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {}
  const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
  const allPosts = await Post.find(q).populate({
    path: 'user',
    select: 'name photo'
  }).populate({
    path: 'comments',
    select: 'comment user'
  }).sort(timeSort)
  handelSuccess(res, allPosts)
}

exports.getPost = async (req, res, next) => {
  const { id } = req.params
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
  if (data.content === undefined || data.content === null || data.content.trim() === '') {
    return next(appError(400, 'content 未填寫', next))
  }
  if (data.image && !validator.isURL(data.image, { protocols: ['https'] })){
    return next(appError(400, 'image 網址不正確', next));
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
  if (data.image && !validator.isURL(data.image, { protocols: ['https'] })){
    return next(appError(400, 'image 網址不正確', next));
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

exports.postComment = async (req, res, next) => {
  const user = req.user.id
  const post = req.params.id
  const { comment, image } = req.body
  if (comment === undefined || comment === null || comment.trim() === '') {
    return next(appError(400, 'comment 未填寫', next))
  }
  if (image && !validator.isURL(image, { protocols: ['https'] })){
    return next(appError(400, 'image 網址不正確', next));
  }
  const newComment = await Comment.create({
    comment,
    post,
    user,
    image
  })
  handelSuccess(res, newComment)
}

exports.deleteComment = async (req, res, next) => {
  const user = req.user.id
  const comment = await Comment.findOne({
    _id: req.params.id
  })
  if (!comment) {
    return next(appError(400, '找不到此留言', next))
  }
  if (user !== comment.user.id) {
    return next(appError(400, '你不是此留言的發文者', next))
  }
  await Comment.findByIdAndDelete(
    {
      _id: req.params.id
    }
  )
  handelSuccess(res)
}

exports.updateComment = async (req, res, next) => {
  const data = req.body
  if (data.comment === undefined || data.comment === null || data.comment.trim() === '') {
    return next(appError(400, 'comment 未填寫', next))
  }
  const user = req.user.id
  const comment = await Comment.findOne({
    _id: req.params.id
  })
  if (!comment) {
    return next(appError(400, '找不到此留言', next))
  }
  if (user !== comment.user.id) {
    return next(appError(400, '你不是此留言的發文者', next))
  }
  if (data.image && !validator.isURL(data.image, { protocols: ['https'] })){
    return next(appError(400, 'image 網址不正確', next));
  }
  await Comment.findByIdAndUpdate(
    {
      _id: req.params.id
    },
    {
      comment: data.comment,
      image: data.image
    }
  )
  const newComment = await Comment.findOne({
    _id: req.params.id
  })
  handelSuccess(res, newComment)
}