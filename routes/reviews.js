const express = require('express');
const Router = express.Router({mergeParams: true});
const { validateReview, isLoggedIn, isreviewAuthor } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');

Router.post('/', isLoggedIn ,validateReview,catchAsync(reviews.postReview))
Router.delete('/reviews/:reviewId', isLoggedIn, isreviewAuthor ,catchAsync(reviews.deleteReview));

module.exports = Router;