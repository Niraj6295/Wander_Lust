const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ip = require('ip');

//  Reviews post route (Creates new reviews)
module.exports.createReview = async(req,res)=>{
    console.log(ip.address()+ " reviews");
    let {id} = req.params;
    // console.log(req.body.review);
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created Successfully !!")
    res.redirect(`/listings/${id}`)
};

// Reviews delete route (deletes reviews)
module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId}= req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully !!")
    res.redirect(`/listings/${id}`)
  
};
