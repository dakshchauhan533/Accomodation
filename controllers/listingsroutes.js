const listing = require("../models/listing");
const { listingschema } = require("../schema"); // Ensure the schema is correctly imported
const expresserror = require("../utils/expresserror"); // Ensure this utility is defined for error handling

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const maptoken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: maptoken });





// NEWLISTING FORM ROUTE
module.exports.newform = (req, res) => {
    res.render("listings/new.ejs");
};

// INDEX ROUTE
module.exports.index = async (req, res) => {
    const alllistings = await listing.find();
    res.render("listings/index.ejs", { alllistings });
};

// SHOW ROUTE
module.exports.show = async (req, res, next) => {
    const { id } = req.params;
    const showdata = await listing.findById(id)
        .populate({ path: "review", populate: { path: "author" } })
        .populate("owner");

    if (!showdata) {
        req.flash("error", "Listing you searched for does not exist");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { showdata });
};

// POST LISTING ROUTE
module.exports.postlisting = async (req, res, next) => {
  let result =  await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
 
    const { error } = listingschema.validate(req.body);

    if (error) {
        req.flash("error", error.details[0].message); // Flash validation error message
        return res.redirect("/listings/new"); // Redirect to form
    }
    
    const { path: url, filename } = req.file; // Destructure uploaded file details
    const newlisting = new listing(req.body.listing);

    try {
        newlisting.owner = req.user._id;
        newlisting.image = { url, filename };
        newlisting.Geometry = result.body.features[0].geometry;
        let savedlist=  await newlisting.save();
        console.log(savedlist);

        req.flash("success", "Listing created successfully");
        return res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

// EDIT LISTING ROUTE
module.exports.editroute = async (req, res, next) => {
    const { id } = req.params;
    const data = await listing.findById(id);

    if (!data) {
        req.flash("error", "Listing you searched for does not exist");
        return res.redirect("/listings");
    }
    
    let originalimage = data.image.url;
    
     let originalimageurl = originalimage.replace("/upload","/upload/h_300,w_300")

    res.render("listings/edit.ejs", { data,originalimageurl });
};

// UPDATE ROUTE
module.exports.updateroute = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    const updatedListing = await listing.findByIdAndUpdate(id, { ...data });
    if(typeof req.file !== "undefined"){
         let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = {url,filename};
     await updatedListing.save();
    }

    if (!updatedListing) {
        return next(new expresserror("Listing not found", 404));
    }

    req.flash("success", "Listing updated successfully");
    return res.redirect(`/listings/${id}`);
};

// DELETE LISTING ROUTE
module.exports.deleteroute = async (req, res, next) => {
    const { id } = req.params;
    const list = await listing.findByIdAndDelete(id);

    if (!list) {
        return next(new expresserror("Listing not found", 404));
    }

    req.flash("success", "Listing deleted successfully");
    return res.redirect("/listings");
};