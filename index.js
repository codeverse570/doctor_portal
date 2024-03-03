const express = require("express");
const app = express();
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const path = require("path");
const userRoute= require("./routes/user")
const auth =require("./controllers/authControler")
const errorHandler = require('./controllers/errControler').errorHandler
const cookieparse = require("cookie-parser")
app.use(cookieparse())
const mongoose= require("mongoose")
const morgan= require('morgan');
const { log } = require("console");
app.use(morgan("tiny"))
app.use(express.json({ limit: '10kb' }))
const uri = "mongodb+srv://neeraj:Neeraj%40570@atlascluster.kyrytm8.mongodb.net/?retryWrites=true&w=majority";
const user = require("./models/User").User
const data = require("./models/User").data

mongoose.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(con => {
    console.log("DB connection successful")
})
app.listen(3000,()=>{
    console.log("LISTENNING!");
})
// app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname,`public`)));
app.use("/api/user",userRoute)

app.get("/",auth.isLogIn,(req,res)=>{
    res.render("home.ejs",{title: "Home"});
})
app.get("/login",(req,res)=>{
    res.render("login.ejs",{title: "login",user:false});
})

// route for signup page
app.get("/signup",(req,res)=>{
    res.render("signup.ejs", {title: "signup",user:false});
})
app.use(errorHandler)

// route for history page
app.get("/history",auth.isLogIn,(req,res)=>{
    if(res.locals.user.role=="doctor")
    res.render("history_doctor.ejs");
   else res.render("history_user.ejs");
})


app.get('/findaDoctor', async function(req, res) {
    console.log("hello hfoidshfoishfoisd");
    const allDocs = await user.find({role: "doctor"});
    res.render("findaDoctor", {docArray: allDocs});

})


app.get("/form",auth.isLogIn,auth.restrictTo("doctor"),(req,res)=>{
    res.render("form.ejs");
})


