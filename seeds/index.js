require('dotenv').config();
const mongoose = require('mongoose');
const Campground = require('../models/Campgrounds');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose
  .connect('mongodb+srv://nikhil:2hgHdMaDfdoiMHrs@cluster0.8lxrq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error:', err));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  console.log('Clearing existing campgrounds...');
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 1000);
    const authors = [
      '65360bb87d2ce94007079832',
      '654b5839285f608ed7882af5',
      '654b5c04d81e97340cf1ffa0',
      '654b5be1d81e97340cf1fe6c',
    ];
    const camp = new Campground({
      author: sample(authors),
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[random].Longitude, cities[random].Latitude],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/domn1fj2f/image/upload/v1690000961/goCamp/db6b6yrfaomi4vggnzu7.webp',
          filename: 'goCamp/qcpkoic6ip48gb85ba0q',
        },
      ],
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates vel officia repellendus tempora voluptatum, illum sit doloribus consectetur? Nobis sed aperiam accusantium impedit voluptate possimus vero sequi accusamus illum ullam.',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log('Database seeding completed and connection closed.');
});
