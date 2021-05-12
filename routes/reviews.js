const express = require('express')
const router = express.Router({ mergeParams: true })

const Campground = require('../models/campground')
const Review = require('../models/review')

const catchAsync = require('../utils/catchAsync')
const { validateReview } = require('../middleware')
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
