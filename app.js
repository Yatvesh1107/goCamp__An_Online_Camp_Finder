require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const User = require('./models/user');
const Campground = require('./models/Campgrounds')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo')
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));
console.log(process.env.MONGO_URI)
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("MongoDB Connection Error:", err));
mongoose.set('debug', true);


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const sessionConfig = {
  secret: 'hello',
  name: 'blah',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());

// passport
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.query);
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  app.locals.currentUser = req.user;
  next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id', reviewRoutes);

app.get('/', (req, res) => {
  res.render('home');
})

app.get('/categories', (req, res) => {
  res.render('categories')
})

app.get('/categories/resorts', async (req, res) => {
  const resorts = await Campground.find({ title: { $regex: 'resort', $options: 'i' } });
  res.render('campgrounds/resorts', { resorts });
})
app.get('/categories/camps', async (req, res) => {
  const camps = await Campground.find({ title: { $regex: 'camp', $options: 'i' } });
  res.render('campgrounds/camps', { camps });
})

app.get('/categories/restaurants', async (req, res) => {
  const hotels = await Campground.find({ title: { $regex: 'restaurant' || 'hotel', $options: 'i' } });
  res.render('campgrounds/hotels', { hotels });
})

app.all('*', (req, res, next) => {
  next(new expressError('Page not found', 404));
  // from this the message and statuscode will be passed as an err in next.
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})
app.listen(3000, () => {
  console.log("Listening on 8080 port!!!");
})