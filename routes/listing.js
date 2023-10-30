const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


 
// Index route (shows all listings)
router.get("/",wrapAsync(listingController.index));

// New route (new listing form reder)
router.get("/new",isLoggedIn,listingController.new);

// Filtered Listings 
router.get("/icons",listingController.filteredListing);

// Show route (show one listing in details)
router.get("/:id",wrapAsync(listingController.show));

// Create route (new listing creater)
router.post("/",isLoggedIn ,validateListing,upload.single("listing[image]"),wrapAsync(listingController.create));

// Edit route (renders edit form of listings)
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.edit));

// Update route (updates listing details)
router.patch("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.update));

// Destroy route (deletes listing)
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroy));

module.exports = router;