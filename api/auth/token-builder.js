const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets"); // use this secret!


module.exports = function (user) {
  const { user_id, username, role_name } = user[0]
    const payload = {
        subject: user_id,
        username: username,
        role_name: role_name,
      }
    const options = {
      expiresIn: '1d'
      }
      return jwt.sign(
        payload,
        JWT_SECRET,
        options,
      )
}