const User = require('../models/user');

module.exports.renderRegisterForm = (req,res)=> {
  res.render('users/register')
}

module.exports.postRegisterForm = async(req,res)=> {
  try{
  const {username, password, email} = req.body;
  const user = new User({username, password, email});
  const newUser = await User.register(user, password);
  req.login(newUser, err => {
    if(err) return next(err);
    req.flash('success','welcome to GoCamp');
    res.redirect('/campgrounds');
  })
  }
  catch(e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}

module.exports.renderLoginForm = (req,res)=> {
  res.render('users/login')
}

module.exports.postLoginForm = (req,res)=> {
  req.flash('success', 'Login successful');
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
}

module.exports.renderLogout = (req,res)=> {
  req.logout(function (err) {
    if (err) {
        return next(err);
    }
  req.flash('success', 'GoodBye!');
  res.redirect('/campgrounds')
})
}
