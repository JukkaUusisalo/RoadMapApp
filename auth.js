

function setupAuth(User, app) {
  var passport = require('passport');
  var GitHubStrategy = require('passport-github').Strategy;

  // High level serialize/de-serialize configuration for passport
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
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
                            
                            'profile.username': profile.username,
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
    passport.authenticate('github', { successRedirect: '/',
                                      failureRedirect: '/fail' }));
}

module.exports = setupAuth;
