const user = require("../models/user.js")


// SINGUP FORM

module.exports.showsignupform = (req,res)=>{
    res.render("../views/users/signup.ejs");
}

// REGISTERING USER

module.exports.postsignup = async(req,res)=>{
    try{
         let {username,email,password} = req.body;
    const registeringuser = new user({email,username});
   const registereduser =  await user.register(registeringuser,password);
    console.log(registereduser);
     req.login(registereduser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","user registered succesfully");
    res.redirect("/listings")})
    }catch(e){
        req.flash("error","given username is already registered try another one");
        res.redirect("/signup");
    }
   
}

// SHOW LOGIN FORM

module.exports.showloginform = async(req,res)=>{
    res.render("../views/users/login.ejs");
}

// LOGIN USER

module.exports.postlogin = async(req,res)=>{
    req.flash("success","welcome to ACCOMODATION.");
    let redirecturl =  res.locals.redirecturl || "/listings";
    res.redirect(redirecturl);
}

// LOGOUT USER

module.exports.logoutroute = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You Logged out succesfully");
        res.redirect("/listings");
    })
}