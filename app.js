"use strict";

var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

app.set('view engine', 'ejs');
app.use(session(
  {
    secret: 'iojoewijoijv',
    resave: false,
    saveUninitialized: true
  }
));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());    // must be after bodyParser;

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(obj, done) {
  done(null, JSON.parse(obj));
});

passport.use(new localStrategy(
  function(username, password, done) {
    User.findOne({ username: username },
      function(err, user) {
        if (err)
          return done(err);
        else if (!user)
          return done(null, false, { message: 'incorrect username' });
        else if (!user.validPassword(password))
          return done(null, false, { message: 'incorrect password' });
        return done(null, user);
      }
    );
  }
));

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/login', function(req, res) {
  res.render('login', { user: req.user, messages: req.flash('error')
  });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/', function(req, res) {
  res.send('hello');
});

app.get('/secret', ensureAuthenticated, function(req, res) {
  res.send('secret');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

app.listen(3000);

// make User to test since a model was not created;
var User = {
  findOne: function(opts, cb) {
    var user = {
      id: 1,
      username: opts.username,
      password: 'mySecret',   // use this password to test!
      validPassword: function(password) {
        return password === 'mySecret';
      }
    };
    cb(null, user);
  }
};
