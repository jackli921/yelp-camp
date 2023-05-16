const User = require('../models/user')
const express = require('express')
const passport = require('passport')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {storeReturnTo} = require('../middleware')
const userController = require("../controllers/users")

router.get('/register', userController.renderRegister)

router.post('/register', catchAsync(userController.createUser))

router.get('/login', userController.renderLogin)

router.post("/login", storeReturnTo, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.login);

router.get('/logout', userController.logout)

module.exports = router