const Review = require('../models/reviews');
const Campground = require('../models/Campgrounds');

module.exports.postReview = async(req,res)=> {
  const campgrounds = await Campground.findById(req.params.id);
  const reviews =  new Review(req.body.review);
  reviews.author = req.user._id;
  campgrounds.reviews.push(reviews);
  await campgrounds.save();
  await reviews.save();
  req.flash('success', 'Successfuly posted review');
  res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.deleteReview = async(req,res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Successfuly deleted review');
  res.redirect(`/campgrounds/${id}`)
}

