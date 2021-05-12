const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const catchAsync = require('../utils/catchAsync')

// shows all campgrounds
router.get('/', catchAsync(campgrounds.index))

// form to create a new campground
router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm))

// submitting new campground to database
router.post(
  '/',
  validateCampground,
  isLoggedIn,
  catchAsync(campgrounds.createNewCampground)
)

// show one individual campground
router.get('/:id', catchAsync(campgrounds.showCampground))

// show edit form for campground
router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
)

// update campground to database
router.put(
  '/:id',
  validateCampground,
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.editCampground)
)

// delete campground from database
router.delete('/:id', isLoggedIn, catchAsync(campgrounds.deleteCampground))

module.exports = router
