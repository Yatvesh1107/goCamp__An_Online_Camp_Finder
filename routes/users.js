const express = require('express');
const Router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users');

Router.route('/register')
.get(users.renderRegisterForm)
.post(users.postRegisterForm);

Router.route('/login')
.get(users.renderLoginForm)
.post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),users.postLoginForm);

Router.get('/logout', users.renderLogout);

module.exports = Router;