const express = require("express");
const app = express();
const path = require("path");

app.listen(3000,()=>{
    console.log("LISTENNING!");
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,`public`)));

// route for home page
app.get("/",(req,res)=>{
    res.render("home.ejs",{title: "Home",user:false});
})
// route for login page
app.get("/login",(req,res)=>{
    res.render("login.ejs",{title: "login",user:false});
})

// route for signup page
app.get("/signup",(req,res)=>{
    res.render("signup.ejs", {title: "signup",user:false});
})


