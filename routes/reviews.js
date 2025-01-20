const express = require('express');
const router = express.Router({ mergeParams:true });
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas')

// MIDDLEWARE

const validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body)
    if (result.error) {
        throw new ExpressError(result.error.details[0].message, 400)
    } else {
        next();
    }
}

// REVIEW
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'New Review created')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', catchAsync(async (req, res) =>{
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review deleted')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;