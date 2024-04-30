const express = require("express");
const app = express();
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })
const path = require("path");
const userRoute = require("./routes/user")
const auth = require("./controllers/authControler")
const errorHandler = require('./controllers/errControler').errorHandler
const cookieparse = require("cookie-parser")
app.use(cookieparse())
const mongoose = require("mongoose")
const morgan = require('morgan');
const { log } = require("console");
app.use(morgan("tiny"))
app.use(express.json({ limit: '10kb' }))
const uri = "mongodb+srv://neeraj:Neeraj%40570@atlascluster.kyrytm8.mongodb.net/?retryWrites=true&w=majority";
const user = require("./models/User").User


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => {
    console.log("DB connection successful")
})

// app.use(express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, `public`)));

app.use("/api/user", userRoute)

app.get("/", auth.isLogIn, (req, res) => {
    res.render("home.ejs", { title: "Home" });
})
app.get("/login", auth.isLogIn, (req, res) => {
    res.render("login.ejs", { title: "login" });
})

// route for signup page
app.get("/signup", auth.isLogIn, (req, res) => {
    res.render("signup.ejs", { title: "signup" });
})

// route for history page
app.get("/history", auth.isLogIn, auth.checkLog, async (req, res) => {
    const currUser = res.locals;

    if (currUser.user.role == 'user') {
        const allHistory = await data.find({ email: currUser.user.email });
        res.render("history_user", { preHistory: allHistory });
    }
    else if (currUser.user.role == 'doctor') {
        const allHistory = await data.find({ doctor: currUser.user._id });
        console.log(allHistory);
        res.render("history_user", { preHistory: allHistory });
    }
})


app.get('/findaDoctor', auth.isLogIn, auth.checkLog, async function (req, res) {
    console.log("hello hfoidshfoishfoisd");
    const allDocs = await user.find({ role: "doctor" });

    res.render("findaDoctor", { docArray: allDocs });

})
app.get("/form", auth.isLogIn, auth.checkLog, auth.restrictTo("doctor"), (req, res) => {
    res.render("form.ejs");
})
app.get("/profile", auth.isLogIn, auth.checkLog, (req, res) => {
    res.render("profile")
})
app.use(errorHandler)
app.listen(3000, () => {
    console.log("LISTENNING!");
})

