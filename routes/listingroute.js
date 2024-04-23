if(process.env.NODE_env != "production"){
    require('dotenv').config();
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controller/listingController.js")
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
//INDEX ROUTE
.get(wrapAsync(listingController.index))
//Create Route
.post(isLoggedIn, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));
    
//New Route
router.get(
    "/new",
    isLoggedIn,
    listingController.renderNewForm);

router.get(
    "/admin/allbookings",
    isLoggedIn,
    listingController.allbookings);
    

router.route("/:id")
//Show Route
.get(wrapAsync(listingController.showListing))
//Update Route
.put(isLoggedIn,
    isOwner, 
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
//Delete Route
.delete(isLoggedIn,
    isOwner, 
    wrapAsync(listingController.destroyListing));


//Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

//Booking Route
router.get(
    "/:id/book",
    isLoggedIn,
    wrapAsync(listingController.bookListing));

router.post(
    "/pay",
    isLoggedIn,
    wrapAsync(listingController.payListing));

//Pay Route    
router.get("/payroute", 
    isLoggedIn, 
    listingController.getPayRoute);

router.post("/payroute", 
    isLoggedIn, 
    listingController.postPayRoute);

module.exports = router;    

//----------------------------------------------------------------------------------------
// Assuming req.body contains:
// {
//   listing: {
//     title: 'House for Sale',
//     price: 500000,
//     location: 'City Center',
//     bedrooms: 3
//   }
// }

// const newListing = { ...req.body.listing };

// console.log(newListing);
// Output:
// {
//   title: 'House for Sale',
//   price: 500000,
//   location: 'City Center',
//   bedrooms: 3
// }
//---------------------------------------------------------------------------------------------------


