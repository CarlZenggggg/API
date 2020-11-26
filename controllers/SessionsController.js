const User = require('../models/User');
const passport = require('passport');
const viewPath = 'sessions';

exports.new = (req, res) => {
  res.render(`${viewPath}/login`, {
    pageTitle: 'Login'
  });
};


exports.create = (req, res, next) => {
  passport.authenticate('local', {
    successFlash: 'You were successfully logged in.',
    successRedirect: '/',
    failureFlash: 'Invalid credentials',
    failureRedirect: '/login',
  })(req, res, next);
};


exports.delete = (req, res) => {
  req.logout();
  req.flash('success', 'You were logged out successfully.');
  res.redirect('/');
};