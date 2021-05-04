const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const { campgroundSchema, reviewSchema } = require('./schemas')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Review = require('./models/review')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connecton error:'))
db.once('open', () => {
  console.log('DATABASE CONNECTED')
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

// landing page
app.get('/', (req, res) => {
  res.render('home')
})

// shows all campgrounds
app.get(
  '/campgrounds',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
  })
)

// form to create a new campground
app.get(
  '/campgrounds/new',
  catchAsync(async (req, res) => {
    res.render('campgrounds/new')
  })
)

// submitting new campground to database
app.post(
  '/campgrounds',
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

// show one individual campground
app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      'reviews'
    )
    res.render('campgrounds/show', { campground })
  })
)

// show edit form for campground
app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
  })
)

// update campground to database
app.put(
  '/campgrounds/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    })
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

// delete campground from database
app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
  })
)

// post review to specific campground
app.post(
  '/campgrounds/:id/reviews',
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
  })
)

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found!!', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong!' } = err
  if (!err.message) err.message = 'Oh No, Something went wrong!!'
  res.status(statusCode).render('error', { err })
})

app.listen(5000, () => {
  console.log('SERVER IS LISTENING ON PORT 5000...')
})
