const router = require("express").Router();
const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const { JWT_SECRET } = require("../secrets"); // use this secret!
const { add } = require('../users/users-model')
const bcrypt = require('bcryptjs')
const tokenBUilder = require('./token-builder')

router.post("/register", validateRoleName, async (req, res, next) => {
  const { username, password } = req.body
  const role_name = req.role_name
  try{ 
    hash = bcrypt.hashSync(password, 8)
    const newUser = await add({username , password: hash, role_name})
    const result = {
      role_name: newUser.role_name, 
      user_id: newUser.user_id, 
      username: newUser.username
    }
    res.status(201).json(result) 
  } catch (err) {
    next({
      message: 'an error occurred, please try to register again'
    })
  }
});


router.post("/login", checkUsernameExists, async (req, res, next) => {
  try{
    if( bcrypt.compareSync(req.body.password, req.user[0].password)){
      const token = tokenBUilder(req.user)
      res.status(200).json({
        message: `${req.body.username} is back!`,
        token,
      })
    } else {
      next({
        status: 401,
        message: "invalid credentials"
      })
    }
  } catch (err) {
    next({status: 401, message: 'invalid credentials'})
  }
});

module.exports = router;
