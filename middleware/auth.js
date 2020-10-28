const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  // Get token from Header
  const token = req.header('x-auth-token')

  // check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, Authorization denied' })
  }

  // verify token
  try {
    const decoded = jwt.verify(token, process.env.jwtSecret)

    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Invalid Token' })
  }
}
