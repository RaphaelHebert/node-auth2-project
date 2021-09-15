const { JWT_SECRET } = require("../secrets"); // use this secret!
const jwt = require('jsonwebtoken')
const Users = require('../users/users-model')

const restricted = (req, res, next) => {
  const token = req.headers.authorization
  if(token){
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err){
        next({
          message: "Token invalid",
          status: 401
        })
      } else {
        req.decodedToken = decoded;
        next()
      }
    }) 
  } else {
    next({ 
      message: "Token required",
      status: 401
  })
  }
}

const only = role_name => (req, res, next) => {
  if(req.decodedToken.role_name === role_name){
    next()
  } else {
    next({ message: "This is not for you", status: 403 })
  }
  /*
    If the user does not provide a token in the Authorization header with a role_name
    inside its payload matching the role_name passed to this function as its argument:
    status 403
    {
      "message": "This is not for you"
    }

    Pull the decoded token from the req object, to avoid verifying it again!
  */
}


const checkUsernameExists = async (req, res, next) => {
  const user = await Users.findBy({username: req.body.username})
  if(user.length < 1){
    next({
      message: "invalid credentials",
      status: 401
    })
  } else {
    req.user = user
    next()
  }
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
}


const validateRoleName = (req, res, next) => {
  if (!req.body.role_name || !req.body.role_name.trim()){
    req.role_name = 'student'
    next()
  } else if ( req.body.role_name.trim() === "admin" ){
    next({
      status: 422,
      message: "Role name can not be admin"
    })
  } else if (req.body.role_name.trim().length > 32){
    next({
      status: 422,
      message: "Role name can not be longer than 32 chars"
    })
  } else {
    req.role_name = req.body.role_name.trim()
    next()
  }
  

  /*
    If the role_name in the body is valid, set req.role_name to be the trimmed string and proceed.

    If role_name is missing from req.body, or if after trimming it is just an empty string,
    set req.role_name to be 'student' and allow the request to proceed.

    If role_name is 'admin' after trimming the string:
    status 422
    {
      "message": "Role name can not be admin"
    }

    If role_name is over 32 characters after trimming the string:
    status 422
    {
      "message": "Role name can not be longer than 32 chars"
    }
  */
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
}
