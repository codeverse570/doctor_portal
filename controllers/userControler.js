const catchAsync = require("./../controllers/errControler").catchAsync
const appError = require('./../utils/appError')
const User = require('./../models/User').User
const apiFeatures = require("./../utils/apiFeatures")
// const factoryController = require("./factoryController")
const sharp = require("sharp")
const multer = require("multer")
const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true)
  }
  else {
    cb(new appError("failed", "please upload a image!"), false)
  }
}
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

const uploadPhoto = upload.single("photo")
module.exports.resizeImage = (req, res, next) => {

  const filename = `user-${req.user._id}-${Date.now()}.jpeg`
   console.log(req.file)
  if (!req.file) return next()
  req.file.filename = filename
  sharp(req.file.buffer).resize(500, 400, { fit: "fill" }).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`public/images/users/${filename}`)
  next()
}
const filterUpdate = (parameters) => {
  let filterBy;
  // console.log(parameters.photo)
  
  if(parameters.photo!=='undefined')  filterBy = ["email", "name", "photo"]
  else filterBy = ["email", "name","phone"]
  console.log(filterBy)
  const newObj = {}
  Object.keys(parameters).forEach(el => {
    if (filterBy.includes(el)) newObj[el] = parameters[el]
  })
  return newObj
}

const updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id })

  if (req.file) req.body.photo = req.file.filename
  if (user) { 
    if (req.body.password) {
      next(new appError("failed", "This route is not for password change"))
    }
    else {
      const filterBody = filterUpdate(req.body)
      console.log(filterBody)
      const updatedUser = await User.findOneAndUpdate({ _id: user._id }, filterBody, { new: true })
      res.status(200).json({
        message: "Success",
        data: updatedUser
      })
    }
  }
  else {
    next(new appError("failed", "User not found"))
  }
})


module.exports.uploadPhoto = uploadPhoto
module.exports.updateMe = updateMe
