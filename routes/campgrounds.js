const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router
  .route('/')
  .get(catchAsync(campgrounds.index))
  .post(
    upload.array('image'),
    validateCampground,
    isLoggedIn,
    catchAsync(campgrounds.createNewCampground)
  )

router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm))

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    catchAsync(campgrounds.editCampground)
  )
  .delete(isLoggedIn, catchAsync(campgrounds.deleteCampground))

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
)

module.exports = router
