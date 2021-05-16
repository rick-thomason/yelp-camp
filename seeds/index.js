const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground')
const { descriptors, places } = require('./seedHelpers')

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

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '609976d1800a0a1ae0ebea8a',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis autem ducimus iste dolores. Asperiores placeat alias eligendi, distinctio fugit nulla facilis cum impedit iure atque possimus, quam eos inventore sunt aut porro nemo magni, blanditiis dignissimos molestias ab repellat! Natus quis omnis exercitationem labore eius qui debitis praesentium animi optio.',
      price,
      images: [
        {
          url: 'https://res.cloudinary.com/dlsnm0gfp/image/upload/v1621188390/YelpCamp/za7jnbdhyzottk4pgbr2.jpg',
          filename: 'YelpCamp/za7jnbdhyzottk4pgbr2',
        },
        {
          url: 'https://res.cloudinary.com/dlsnm0gfp/image/upload/v1621188390/YelpCamp/zphcmramwfidnbmaypi8.jpg',
          filename: 'YelpCamp/zphcmramwfidnbmaypi8',
        },
        {
          url: 'https://res.cloudinary.com/dlsnm0gfp/image/upload/v1621188390/YelpCamp/sakpzpeppzxoalsaioon.jpg',
          filename: 'YelpCamp/sakpzpeppzxoalsaioon',
        },
        {
          url: 'https://res.cloudinary.com/dlsnm0gfp/image/upload/v1621188390/YelpCamp/wy4xrh667n01udgskalh.jpg',
          filename: 'YelpCamp/wy4xrh667n01udgskalh',
        },
      ],
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
