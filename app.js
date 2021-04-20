const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

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

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))

// landing page
app.get('/', (req, res) => {
  res.render('home')
})

// shows all campgrounds
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

// form to create a new campground
app.get('/campgrounds/new', async (req, res) => {
  res.render('campgrounds/new')
})

// submitting new campground to database
app.post('/campgrounds', async (req, res) => {
  const campground = new Campground(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
})

// show one individual campground
app.get('/campgrounds/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
})

app.listen(5000, () => {
  console.log('SERVER IS LISTENING ON PORT 5000...')
})
