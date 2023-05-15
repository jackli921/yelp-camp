const User = require('../models/user')
const express = require('express')
const passport = require('passport')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {storeReturnTo} = require('../middleware')

router.get('/register', (req,res)=>{
    res.render('users/register')
})

router.post('/register', catchAsync(async(req,res, next)=>{
    try{
        const {email, username, password} = req.body
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err=> {
          if(err) return next(err)
          req.flash("success", "Welcome to YelpCamp!");
          res.redirect("/campgrounds");
        })
    }
    catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }

}))

router.get('/login', (req,res)=>{
    res.render('users/login')
})

router.post("/login", storeReturnTo, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    //access the original url stored in locals to redirect user
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete res.locals.returnTo
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res, next)=>{
  req.logout(function(err){
    if(err){return next(err)}
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
  })
})

module.exports = router