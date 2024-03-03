const User = require("../models/User").User;
const data = require("../models/User").Data;
const jwt = require("jsonwebtoken")
const appError = require("../utils/appError")
const catchAsync = require("./errControler").catchAsync
const {promisify}= require("util")
const Email = require("./../utils/email")


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
      // console.log(req.body)
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

const logIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      next(new appError("failed", "Please Enter Email or Password"))
    }
    else {
      const user = await User.findOne({ email }).select("+password")
      if (!user) next(new appError("failed", "Email does not exist!"))
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
  console.log(payload)
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
      if (roles.includes(res.locals.user.role)) {
        next()
      }
      else {
        return next(new appError("failed", "You are not authorized to view this page"))
      }
    }
  }
  module.exports.signUp= signUp
  module.exports.isLogIn=isLogIn
  module.exports.logIn= logIn
  module.exports.logOut= logOut
  module.exports.restrictTo= restrictTo
  module.exports.addData=addData