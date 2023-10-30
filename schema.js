const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        category : Joi.string(),
        location : Joi.string().required(),
        country : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().allow("",null)
    }).required()
})
module.exports.reviewSchema =  Joi.object({
    reviews : Joi.object({
        rating : Joi.number().min(1).max(5).required(),
        comment : Joi.string().required()
    }).required()
})