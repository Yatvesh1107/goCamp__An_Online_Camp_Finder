const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;


const ImagesSchema = new Schema ({
  url: String,
  filename: String
})

ImagesSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_150');
});

const opts = { toJSON: { virtuals: true }};

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  images: [ImagesSchema],
  geometry: {
    type: {
      type: String, 
      enum: ['Point'], 
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }, 
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: 'Review'
    }
  ]
},opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0,30)}...</p>`
});

CampgroundSchema.post('findOneAndDelete', async function(data) {
  if(data) {
    await Review.deleteMany({
      _id: {
         $in: data.reviews
        }
    })
  }
})
module.exports = mongoose.model('Campground', CampgroundSchema);