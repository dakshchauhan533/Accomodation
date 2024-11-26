


const express = require("express");
const router = express.Router({ mergeParams: true });
const expresserror = require("../utils/expresserror.js");
const wrapasync = require("../utils/errorwrap");
const listing = require("../models/listing.js");
const review = require("../models/review.js");
const { reviewschema } = require("../schema.js"); 
const { isloggedin, isauthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviewsroutes.js");




// POST ROUTE

router.post("/",isloggedin, wrapasync(reviewcontroller.postroute));

// DELETE ROUTE

router.delete("/:reviewid",isloggedin,isauthor, wrapasync(reviewcontroller.destroyroute));

module.exports = router;
