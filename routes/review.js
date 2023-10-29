const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const {validateReviews, isLoggedIn,isAuthor}= require("../middleware.js")
const reviewController = require("../controller/review.js")

//  Reviews post route (Creates new reviews)
router.post("/",isLoggedIn,validateReviews,wrapAsync (reviewController.createReview));

//  Reviews delete route (deletes reviews)
router.delete("/:reviewId", isLoggedIn,isAuthor,wrapAsync (reviewController.deleteReview));

module.exports = router;