const express = require("express")
const router = express.Router()
const User = require("../models/user")
const Recipes = require("../models/recipes")
const catchAsync = require("../utils/catchAsync")
const expressError = require("../utils/expressError")
const flash = require('connect-flash')
const passport = require("passport")
const LocalPassport = require("passport-local")
const {isLoggedIn} = require("../middleware")
const multer = require("multer")
const { storage}= require("../cloudinary")
const upload = multer({ storage })

router.get("/", (req,res)=>{
    res.render("home")
})

router.get("/recipes", isLoggedIn, async (req,res)=>{
    const recipes = await Recipes.find({})
    res.render("recipes", {recipes })
})

router.get("/new", isLoggedIn, (req, res) => {
    res.render("new")
})

router.post("/new", isLoggedIn, upload.array("image"),catchAsync(async (req, res, next) => {
    const recipe = new Recipes(req.body.recipe)
    recipe.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    await recipe.save()
    console.log(recipe)
    req.flash("success", "Successfully made a new recipe!")
    res.redirect(`/recipes/${recipe._id}`)
}))

router.get("/register", (req,res)=> {
    res.render("register")
})

router.post("/register", catchAsync(async (req,res)=>{
    try {
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = await User.register(user, password)
    req.flash("success", "Welcome to FoodRecipes")
    res.redirect("/recipes")
    } catch (e){
        req.flash("error", e.message)
        res.redirect("/register")
    }
   
}))

router.get("/login", (req,res)=>{
    res.render("login")
})


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/recipes';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get("/logout", function(req,res,next) { 
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
    })
    req.flash("success", "Goodbye!")
    res.redirect("/")
})

router.get("/recipes/:id", async(req,res)=> {
    const recipe = await Recipes.findById(req.params.id)
    res.render("show", {recipe})
})

router.get("/recipes/:id/edit", async(req, res)=> {
    const recipe = await Recipes.findById(req.params.id)
    res.render("edit", { recipe })
})

router.put("/recipes/:id", async(req,res)=>{
    const { id } = req.params
    const recipe = await Recipes.findByIdAndUpdate(id, {...req.body.recipe})
    res.redirect(`/recipes/${recipe._id}`)
})

router.delete("/recipes/:id", async(req,res)=>{
    const { id } = req.params
    await Recipes.findByIdAndDelete(id)
    res.redirect("/recipes")
})

module.exports = router
