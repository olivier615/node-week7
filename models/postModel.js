const User = require('../models/userModel')
const mongoose = require('mongoose')
const Comment = require('../models/commentsModel')
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '文章內容未填寫']
    },
    tags: {
      type: [String],
      required: [true, '文章標籤 tags 未填寫']
    },
    type: {
      type: String,
      enum: ["group", "person"],
      required: [true, '貼文類型 type 未填寫或不正確, 請選擇 group 或 person']
    },
    image: {
      type:String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user', // 對應 collection 名稱
        required: [true, '貼文 id 未填寫']
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'user'
      }
    ]
  },
  {
    versionKey: false,
    // 當使用 virtual 時，要加上以下兩行
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// 虛擬 comments
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post', // 對應 commentSchema 裡面的 post
  localField: '_id' // 對應 postSchema 的 _id
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post