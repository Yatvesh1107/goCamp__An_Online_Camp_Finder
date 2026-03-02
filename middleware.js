const { campgroundSchema,reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/Campgrounds');
const Review = require('./models/reviews');


module.exports.isLoggedIn = async(req,res,next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error','Please login to continue');
    return res.redirect('/login');
  }
  next();
}

module.exports.storeReturnTo = async(req,res,next) => {
  if(req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  console.log(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}
module.exports.isAuthor = async(req,res,next)=> {
  const {id} = req.params;
  const campgrounds = await Campground.findById(id);
  if(!campgrounds.author._id.equals(req.user._id)) {
    req.flash('error','You are not allowed');
    return res.redirect(`/campgrounds/${campgrounds._id}`)
  }
  next();
}
module.exports.isreviewAuthor = async(req,res,next)=> {
  const {id, reviewId} = req.params;
  const reviews = await Review.findById(reviewId);
  if(!reviews.author.equals(req.user._id)) {
    req.flash('error','You are not allowed');
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}