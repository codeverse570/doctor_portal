const express = require("express")///hello
const auth=require("./../controllers/authControler")
const route = express.Router();

route.route('/signup').post(auth.signUp);
route.route('/login').post(auth.logIn)
route.route('/logout').get(auth.logOut)

route.route('/postData').post(auth.isLogIn,auth.addData)

module.exports=route