const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/errorwrap");
const user = require("../models/user.js")
const usercontroller = require("../controllers/usersroutes.js")
const passport = require("passport");
const {saveredirecturl} = require("../middleware.js");

router.route("/signup")
.get(usercontroller.showsignupform)
.post(wrapasync(usercontroller.postsignup));



router.route("/login")
.get(usercontroller.showloginform)
.post(saveredirecturl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),usercontroller.postlogin);


// LOGOUT USER

router.get("/logout",usercontroller.logoutroute)



module.exports = router;
