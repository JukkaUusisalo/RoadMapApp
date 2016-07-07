

function setupAuth(User, app) {
  var passport = require('passport');
  var GitHubStrategy = require('passport-github').Strategy;

  // High level serialize/de-serialize configuration for passport
  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function(user, done) {
    User.
      findOne({ username : username }).
      exec(done);
  });
  
  // Github stuff
  
    var config = require('./config.json');
  
    passport.use(new GitHubStrategy(
        config.github,
        function(accessToken, refreshToken, profile, done) {
            if (!profile.emails || !profile.emails.length) {
                return done('No emails associated with this account!');
            }
            var picture = "";
            if(profile.photos && profile.photos.length>0) {
                picture = profile.photos[0];
            }
            User.findOneAndUpdate(
                { 'data.oauth': profile.id },
                {
                    $set: {
                            'profile.username': profile.emails[0].value,
                            'profile.email': profile.emails[0].value,
                            'profile.picture': picture
                    }
                },
                { 'new': true, upsert: true, runValidators: false },
                function(error, user) {
                    done(error, user);
                });
        
        }
    ));


  // Express middlewares
  app.use(require('express-session')({
    secret: 'this is a secret'
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  
 
  // Express routes for auth
  app.get('/auth/github',
    passport.authenticate('github', { scope: ['email'] }));

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/fail' }),
    function(req, res) {
      res.send('Welcome, ' + req.user.profile.username);
    });
}

module.exports = setupAuth;
