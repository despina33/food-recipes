if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

const express = require("express")
const mongoose = require("mongoose")
const User = require("./models/user")
const Recipes = require("./models/recipes")
const PORT = 3000
const ejsMate = require("ejs-mate")
const session = require("express-session")
const validator = require("validator")
const path = require("path")
const methodOverride = require('method-override')
const passport = require("passport")
const LocalPassport = require("passport-local")
const catchAsync = require("./utils/catchAsync")
const expressError = require("./utils/expressError")
const flash = require('connect-flash')


const routes = require("./routes/routes")



mongoose.connect('mongodb://127.0.0.1:27017/food-receipts')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/views'))
app.use(methodOverride('_method'))

const sessionConfig = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUnitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24* 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalPassport(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
}) 


app.use("/", routes)
                                               

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.listen(PORT, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});
