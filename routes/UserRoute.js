const express = require("express");
const router = express.Router({ mergeParams : true});
const User = require("../Models/User.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controller/usersController.js")

router.route("/signup")
//get request for signup
.get((req,res)=>{
    res.render("users/signup.ejs");
})
//post request for signup
.post(wrapAsync(userController.signup));



router.route("/login")
//get request for login
.get((req,res)=>{
    res.render("users/login.ejs");
})
//post request for login
.post(saveRedirectUrl,
    passport.authenticate('local',{ 
    failureRedirect: '/login', 
    failureFlash : true,
    }),
    userController.login);



//logout route
router.get("/logout",userController.logout);

module.exports = router;