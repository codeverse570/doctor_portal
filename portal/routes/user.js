const express = require("express")
const auth=require("./../controllers/authControler")
const route = express.Router();
route.route('/signup').post(auth.signUp);
route.route('/login').post(auth.logIn)
route.route('/logout').get(auth.logOut)
module.exports=route