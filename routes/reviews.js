const express = require('express')
const router = express.Router({ mergeParams: true })
const { reviewSchema } = require('../schemas')

const Campground = require('../models/campground')
const Review = require('../models/review')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

// post review to specific campground
router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

// delete reviews for campground
router.delete(
  '/:reviewID',
  catchAsync(async (req, res) => {
    const { id, reviewID } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
  })
)

module.exports = router
