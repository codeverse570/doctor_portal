const express = require("express")///hello
const auth=require("./../controllers/authControler")
const user= require("./../controllers/userControler")
const route = express.Router();

route.route('/signup').post(auth.signUp);
route.route('/login').post(auth.logIn)
route.route('/logout').get(auth.logOut)
// route.route('/updateme').patch(auth.checkLog,user.uploadPhoto,user.resizeImage,user.updateMe)
route.route('/postData2').post(auth.isLogIn,auth.addData2)
route.route('/postData').post(auth.isLogIn,auth.addData)

// route.route("/changepassword").patch(auth.changePassword)
module.exports=route