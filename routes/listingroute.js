


const express = require("express");
const router = express.Router();
const wrapasync = require("../utils/errorwrap");
const expresserror = require("../utils/expresserror.js");
const { listingschema, reviewschema,userschema } = require("../schema.js");
const listing = require("../models/listing.js");
let {isloggedin,isowner} = require("../middleware.js");
const listingcontroller = require("../controllers/listingsroutes.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })




// NEW LISTINGFORM ROUTE
router.get("/new",isloggedin, wrapasync(listingcontroller.newform));



// THESE ROUTES ARE DEFINED IN THE CONTROLLER FOLDER YOU CAN MODIFY THE ROUTES THERE.


router.route("/")
.get(wrapasync(listingcontroller.index))
.post(isloggedin,upload.single("listing[image]"),wrapasync(listingcontroller.postlisting));
// .post(upload.single("listing[image]"),(req,res)=>{
//    res.send(req.file);
// })


 

router.route("/:id")
.get( wrapasync(listingcontroller.show))
.patch(isloggedin,isowner,upload.single("image"),wrapasync(listingcontroller.updateroute))
.delete(isloggedin,isowner,wrapasync(listingcontroller.deleteroute));




// EDITROUTE
router.get("/:id/edit",isloggedin,isowner, wrapasync(listingcontroller.editroute));


module.exports = router;
