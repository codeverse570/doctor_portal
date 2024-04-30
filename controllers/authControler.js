const User = require("../models/User").User;
// const data = require("../models/User").Data;
const jwt = require("jsonwebtoken")
const appError = require("../utils/appError")
const catchAsync = require("./errControler").catchAsync
const {promisify}= require("util")
const Email = require("./../utils/email");
<<<<<<< HEAD
const { data } = require("../models/User");
=======
const { Data,Data2} = require("../models/User");
>>>>>>> 6b4ecb5e9e92f03eda40fafc91c24c46be8217d2


const signUp = catchAsync(async (req, res, next) => {
  console.log(req.body)
    const newUser = await User.create(req.body)
    // console.log(newUser)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN
    })
    res.cookie('jwt', token, {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true
    })
    // await new Email(newUser, `http://127.0.0.1:3000/me`).sendWelcomeEmail();
    res.status(201).json({
      message: "success",
      token,
      data: newUser
    })
  }
  )
  

  const addData = catchAsync(async (req, res, next) => {
    req.body.doctor= res.locals.user._id
    console.log(req.body)
    const newData = await data.create(req.body)
    
  
    
    // console.log(newUser)
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: process.env.JWT_EXPIRES_IN
    // })
    // res.cookie('jwt', token, {
    //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    //   secure: true,
    //   httpOnly: true
    // }) 
    // await new Email(newUser, `http://127.0.0.1:3000/me`).sendWelcomeEmail();
    res.status(201).json({
      message: "success",
      data: newData
    })
  }
  )
  const addData2 = catchAsync(async (req, res, next) => {
    // req.body.doctor= res.locals.user._id
    // console.log(req.body)
   console.log(req.body)
    const newData = await Data2.create(req.body)
    // console.log(newUser)
    // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: process.env.JWT_EXPIRES_IN
    // })
    // res.cookie('jwt', token, {
    //   expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    //   secure: true,
    //   httpOnly: true
    // }) 
    // await new Email(newUser, `http://127.0.0.1:3000/me`).sendWelcomeEmail();
    res.status(201).json({
      message: "success",
      data: newData
    })
  }
  )

const logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      next(new appError("failed", "Please Enter Email or Password"))
    }
    else {
      const user = await User.findOne({ email }).select("+password")
      if (!user) return next(new appError("failed", "Email does not exist!"))
      const correct = user.correctPassword(user.password, password)
      if (user && await correct) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRES_IN
        })
        res.cookie('jwt', token, {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
          secure: true,
          httpOnly: true
        })
        res.status(201).json({
          message: "success",
          token,
          data: user
        })
      }
      else {
        res.status(401).json({
          message: "wrong password or email",
  
        })
      }
    }
  }
  )
  const logOut = (req, res, next) => {
    res.cookie('jwt', "", {
      expires: new Date(Date.now() + 10000),
      secure: true,
      httpOnly: true
    })
    res.json({
      status: "success"
    })
  }
  const isLogIn = catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies.jwt) {
      token = req.cookies.jwt
    }
     
    if (!token){ 
      res.locals.user= false;
      return next()
    }
    
    const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
    
     const newUser = await User.findOne({ _id: payload.id })
  
    if (!newUser) {
       res.locals.user= false;
      return next()
    }
    if (newUser.isPassUpdate(payload.iat)) return next()
    res.locals.user = newUser
    next()
  
  }
  )


  const restrictTo = (...roles) => {
    return (req, res, next) => {
      console.log(res.locals.user.role)
      if (roles.includes(res.locals.user.role)) { 
        // console.log('hello')
        
        next()
      }
      else {
      
        return next(new appError("failed", "You are not authorized to view this page"))
      }
    }
  }
  const changePassword = catchAsync(async (req, res, next) => {
    let token;
    const { currentPassword, password, passwordConfirm } = req.body
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }
    else if (req.cookies.jwt) {
      token = req.cookies.jwt
    }
    if (token) {
      const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
      const newUser = await User.findOne({ _id: payload.id }).select('+password')
      if (newUser) {
        req.user = newUser
        const correct = await newUser.correctPassword(newUser.password, currentPassword)
        if (!correct) next(new appError("failed", "current password is not correct!"))
        if (!newUser.isPassUpdate(payload.iat)) {
          newUser.password = password
          newUser.passwordConfirm = passwordConfirm
  
          await newUser.save()
          res.status(200).json({
            message: "success",
            data: newUser
          })
        }
        else next(new appError("failed", "Password is Changed please log in again!"))
      }
      else {
        next(new appError("failed", "User Not Found"))
      }
  
    }
    else {
      next(new appError("failed", "you are not logged in please log in to get access"))
    }
  })
  const checkLog = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
  
      token = req.headers.authorization.split(" ")[1]
    }
    else if (req.cookies.jwt) {
      token = req.cookies.jwt
    }
  
    if (token) {
      const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY)
      const newUser = await User.findOne({ _id: payload.id })
      if (newUser) {
  
        req.user = newUser
        if (!newUser.isPassUpdate(payload.iat)) next()
        else next(new appError("failed", "Password is Changed please log in again!"))
      }
      else {
        next(new appError("failed", "User Not Found"))
      }
  
    }
    else {
      next(new appError("failed", "you are not logged in please log in to get access"))
    }
  
  }
  )
  module.exports.signUp= signUp
  module.exports.isLogIn=isLogIn
  module.exports.logIn= logIn
  module.exports.logOut= logOut
  module.exports.restrictTo= restrictTo
  module.exports.addData=addData
  module.exports.checkLog= checkLog
  module.exports.addData2=addData2
  module.exports.changePassword= changePassword