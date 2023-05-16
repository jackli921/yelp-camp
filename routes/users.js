const User = require('../models/user')
const express = require('express')
const passport = require('passport')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const {storeReturnTo} = require('../middleware')
const userController = require("../controllers/users")


router.route('/register')
  .get(userController.renderRegister)
  .post(catchAsync(userController.createUser))

router.route('/login')
  .get(userController.renderLogin)
  .post(storeReturnTo, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.login);

router.get('/logout', userController.logout)

module.exports = router