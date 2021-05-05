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

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
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

app.use('/campgrounds', campgrounds)
app.use('/reviews', reviews)

// landing page
app.get('/', (req, res) => {
  res.render('home')
})

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
