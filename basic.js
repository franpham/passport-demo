"use strict";

app.use(passport.initialize());
passport.use(new BasicStrategy(
  function(username, password, done) {
    if (username === user.username && password === user.password)
      return done(null, user);
    else
      return done(null, false);
  }
));

app.get('/secret',
  passport.authenticate('basic', { session: true }),
  function(req, res) {
    res.json(req.user);
  }
);

// to get and save user session:

passport.serializeUser(function(id, done) {
  done(null, user.id);
})

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});