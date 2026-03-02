const express = require('express');
const Router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const { validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

Router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground, catchAsync(campgrounds.postNew))

Router.get('/new',isLoggedIn,campgrounds.renderNew);
Router.get('/search', campgrounds.searchcamps);

Router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn ,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.postEdit))
.delete(isLoggedIn,isAuthor, catchAsync(campgrounds.delete))


Router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campgrounds.renderEdit));


module.exports = Router;