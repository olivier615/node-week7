const appError = require('../service/appError.js')
const { ImgurClient } = require('imgur')

exports.uploadPhoto = async (req, res, next) => {
  // 加入環境變數
  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  })
  const response = await client.upload({
    // 將圖片轉為 base64 格式
    image: req.files[0].buffer.toString('base64'),
    type: 'base64',
    // 指定 imgur 的 album
    album: process.env.IMGUR_ALBUM_ID
  })
  res.status(200).json({
    status:'success',
    imgUrl: response.data.link
  })
}