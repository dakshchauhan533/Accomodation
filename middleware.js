const listing  = require("./models/listing");
const review  = require("./models/review");


module.exports.isloggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectRoute = req.originalUrl;
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
}


module.exports.saveredirecturl = (req,res,next)=>{
    if(req.session.redirectRoute){
        res.locals.redirecturl = req.session.redirectRoute;
    }
    next();
}


module.exports.isowner = async(req,res,next)=>{
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if(!Listing.owner.equals(res.locals.curruser._id)){
        req.flash("error","you dont have permission to do this task");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isauthor = async(req,res,next)=>{
    let { id, reviewid } = req.params;
    let Revie = await review.findById(reviewid);
    if(!Revie.author.equals(res.locals.curruser._id)){
        req.flash("error","you dont have permission to do this");
        return res.redirect(`/listings/${id}`);
    }
    next();
}