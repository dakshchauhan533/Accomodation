if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsmate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const user = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

let dburl = process.env.DB_STRING;


app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.engine("ejs", ejsmate);
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const listings = require("./routes/listingroute.js");
const reviews = require("./routes/reviewroute.js");
const users = require("./routes/userroute.js");


main().then(() => console.log("Connected to database")).catch(err => console.log(err));

async function main() {
    const mongourl = 'mongodb://127.0.0.1:27017/accomodation';
    await mongoose.connect(dburl);
}

app.get("/", (req, res) => {
    res.redirect("/listings");
    res.send("Hi! I am Root");
});

// app.get("/demouser",async(req,res)=>{
//     const demouser = new user({
//         email:"chauhandaksh60@gmail.com",
//         username:"dclife"
//     });
//     let registereduser = await user.register(demouser,"dcisgreat");
//     res.send(registereduser);
// })



const store = MongoStore.create({
    mongoUrl:dburl,
    crypto:{secret:process.env.SECRET},
    touchAfter: 24 * 3600
})

store.on("error",()=>{
    console.log("Error in mongo session store",err)
})

const sessionoptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
} 



app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
     
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);








app.use((err, req, res, next) => {
    // if (res.headersSent) {
    //     return next(err);
    // }
    // if (err.name === 'CastError') {
    //     err.message = 'Not Found';
    //     err.status = 400;
    // }
    let { message, status } = err;
    res.render("listings/error.ejs",{message});
});

app.all("*", (req, res) => {
    res.send("The route you are requesting is not available");
});

app.listen(8080, () => {
    console.log("Server working fine");
});


























































// app.get("/testinit",async (req,res)=>{
//     let samplelisting = new listing({
//         title:"jack sparrow the mysterious pirate",
//         description:"jack is a pirate in the abondoned ocean where he finds the lost treasures thet were lost in the void period",
//         image:"",
//         price:2100,
//         location:"tel-aviv",
//         country:"israel"
//     })

//      await samplelisting.save().then(()=>{console.log("saved in db")});
//      res.send("saved in  db");
// })











