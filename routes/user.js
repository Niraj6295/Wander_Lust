const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const ExpressError = require("../utils/ExpressError.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/user.js")

// Signup form render
router.get("/",userController.signupForm);

// Signup up user in DB
router.post("/", wrapAsync(userController.signup));

// Login form render
router.get("/login",userController.loginForm);

// Login user  on website
router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/signup/login",
        failureFlash: true
    }),userController.login
);

// Logout user from website
router.get("/logout",userController.logout)

module.exports = router;