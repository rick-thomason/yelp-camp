const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
const catchAsync = require('../utils/catchAsync')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

router
  .route('/')
  .get(catchAsync(campgrounds.index))
  // .post(
  //   validateCampground,
  //   isLoggedIn,
  //   catchAsync(campgrounds.createNewCampground)
  // )
  .post(upload.array('image'), (req, res) => {
    console.log(req.body, req.files)
    res.send('it worked')
  })

router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm))

router
  .route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(
    validateCampground,
    isLoggedIn,
    isAuthor,
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
