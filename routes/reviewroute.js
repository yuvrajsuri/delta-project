const express = require("express");
const router = express.Router({ mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview , isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controller/reviewController.js")


//Create a new review
router.post("/",
validateReview,
isLoggedIn, 
wrapAsync(reviewController.createReview)); 

//Review DELETE Route
router.delete("/:reviewId",
isLoggedIn,
isReviewAuthor,
wrapAsync(reviewController.destroyReview));

module.exports = router;