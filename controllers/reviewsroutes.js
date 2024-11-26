const review = require("../models/review.js");
const listing = require("../models/listing.js");
const { reviewschema } = require("../schema.js");

// CREATE ROUTE

module.exports.postroute = async (req, res, next) => {
    let listingn = await listing.findById(req.params.id);
    if (!listingn) {
        throw new expresserror('Listing not found', 404);
    }

    let result = reviewschema.validate(req.body);
    if (result.error) {
        console.log("Validation error:", result.error.details);
        throw new expresserror(result.error.details[0].message, 400);
    }

    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    listingn.review.push(newreview);

    await newreview.save();
    await listingn.save();
    req.flash("success","Review created succesfully");

    console.log("saved in the database");
    res.redirect(`/listings/${req.params.id}`);
}

// DESTROY ROUTE

module.exports.destroyroute = async (req, res, next) => {
    let { id, reviewid } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await review.findByIdAndDelete(reviewid);
    req.flash("success","Review Deleted succesfully");

    res.redirect(`/listings/${id}`);
}