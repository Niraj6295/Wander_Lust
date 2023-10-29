const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError");
const { listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You need to Login on Wanderlust!  Before you use this feature");
        return res.redirect("/signup/login")
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if (req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
};

module.exports.isOwner = async(req,res,next)=>{
    try {
        let {id} = req.params;
        let listing = await Listing.findById(id)
        if(!(`${listing.owner._id}`==`${res.locals.currentUser._id}`)){
        req.flash("error","You are not the owner of this listings")
        return res.redirect(`/listings/${id}`)
    };
    next()
        
    } catch (error) {
        // Handle the error gracefully
        const errorMessage = ".Page not present anymore";
        const err = new ExpressError(400, errorMessage);
        next(err);
        
    }
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }

};

module.exports.validateReviews = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        throw new ExpressError(400,error)
    }else{
        next();
    }
};

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId)
    let authorId = review.author._id.toString();
    let currentUserId = res.locals.currentUser._id.toString();
    console.log();
    if(!(authorId === currentUserId)){
        req.flash("error","You are not the owner of this review")
        return res.redirect(`/listings/${id}`)
    };
    next()
}