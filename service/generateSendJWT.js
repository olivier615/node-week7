const jwt = require('jsonwebtoken')

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign({
    id: user._id,
    name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_DAY }
  )
  user.password = undefined
  res.status(statusCode).send({
    status: 'success',
    user: {
      name: user.name,
      token
    }
  })
}

module.exports = generateSendJWT