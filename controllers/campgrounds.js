const Campground = require('../models/Campgrounds');
const { cloudinary } = require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

module.exports.index = async(req,res)=> {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index',{campgrounds, title: 'All camps'});
}
module.exports.searchcamps = async(req,res) => {
  const query = req.query.query;
  const campgrounds = await Campground.find({
    $or: [
      { title: { $regex: query, $options: 'i' }},
      { location: { $regex: query, $options: 'i'}}
    ]});
  // console.log(campgrounds.length)
  if (campgrounds.length == 0) {
    res.render('campgrounds/noresult')
  }
  else {
    res.render('campgrounds/searchcamps', { campgrounds });
}}

module.exports.renderNew = (req,res)=> {
  res.render('campgrounds/new',{title: 'New'});
}

module.exports.postNew = async (req,res,next)=> {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campgrounds.location,
    limit: 1
  }).send()
  const campgrounds = new Campground(req.body.campgrounds);
  campgrounds.geometry = geoData.body.features[0].geometry;
  campgrounds.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  campgrounds.author = req.user._id;
  await campgrounds.save();
  console.log(campgrounds);
  req.flash('success', 'New campground created successfully');
  res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.showCampground = async(req,res)=> {
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  const {id} = req.params;
  const campgrounds = await Campground.findById(id).populate({
   path: 'reviews',
   options: { limit: 5,sort: { _id: -1 } },
   populate: {
    path: 'author',
   }
  }).populate('author');
  console.log(campgrounds);
  if(!campgrounds) {
    req.flash('error', 'Campground not found')
    return res.redirect('/campgrounds', campgrounds);
  }
  res.render('campgrounds/show',{campgrounds, title: campgrounds.title});
}

module.exports.renderEdit = async(req,res)=> {
  const campgrounds = await Campground.findById(req.params.id);
  res.render('campgrounds/edit',{campgrounds, title: 'Edit'});
}

module.exports.postEdit = async(req,res)=> {
  const { id } = req.params;
  const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campgrounds });
  const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
  campgrounds.images.push(...imgs);
  await campgrounds.save();
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campgrounds.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages }}}});
    console.log(campgrounds);
  }
  req.flash('success', 'successfully updated campground')
  res.redirect(`/campgrounds/${campgrounds._id}`);
}

module.exports.delete = async(req,res)=> {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id,{...req.body.campgrounds});
  req.flash('success', 'Successfuly deleted campground');
  res.redirect('/campgrounds');
}