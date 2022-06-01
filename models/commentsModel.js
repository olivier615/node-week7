const mongoose = require('mongoose')
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, '留言內能不能為空']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, '留言必須包含使用者 id']
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'post',
      required: [true, '留言必須屬於一則貼文']
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    versionKey: false
  }
)

// .pre 當使用 find 開頭的語法時，便會觸發此函式
// 從 user 
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name id createdAt'
  })
  next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment