var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());
  
    api.get('/me', function(req, res) {
        if (!req.user) {
            return res.status(status.UNAUTHORIZED).json({ error: 'Not logged in' });
        }
        var user = req.user;
        res.json({ user: user });;
    });
  
  api.get('/user', wagner.invoke(function(User) {
    return function(req, res) {
      User.
        find({}).
        sort({ name: 1 }).
        exec(function(error, users) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ users: users });
        });
    };
   }));
    
   api.get('/user/:userName', wagner.invoke(function(User) {
    return function(req, res) {
      User.
        findOne({'profile.username':req.param.userName})
        .exec(function(error, user) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ user: user });
        });
    };   
  }));
  
   api.put('/user/:userName', wagner.invoke(function(User) {
    return function(req, res) {
      var userData = req.body;
      var query = {'profile.username':req.param.userName};
      var options = {'new':true,'upsert':false};
      User.
        findOne(query)
        .exec(function(error, user) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if(user) {
              var profile = userData.profile;
              var data = userData.data;
              if(profile) user.profile = profile;
              if(data) user.data = data;
              user.save(function (err, updateduser, numAffected) {
                    if (err) {
                        return res.
                               status(status.INTERNAL_SERVER_ERROR).
                               json({ error: err.toString() });
                    }
                    return res.json({ user: updateduser });
              });
            
          } else {
            return res.status(status.NOT_FOUND).json({error:'User not found'});  
          }
        });
    };   
  }));
  
 api.delete('/user/:userName', wagner.invoke(function(User) {
    return function(req, res) {
      var query = {'profile.username':req.param.userName};
      User.
        findOneAndRemove(query)
        .exec(function(error, user) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          if(user) {
            return res.json({ user: user });
          } else {
            return res.status(status.NOT_FOUND).json({error:'User not found'});  
          }
        });
    };   
  }));

  
  
    api.post('/user', wagner.invoke(function(User) {
        return function(req, res) {
            var userData;
            try {
                userData = req.body;
            } catch(e) {
                return res.status(status.BAD_REQUEST).json({ error: 'Bad Request. Maybe missing body!' });
            }
            var u = new User(userData);
            u.save(function(err) {
                if (err) {
                    return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
                }                
            });  
            return res.json({ user: userData });
            };
        })
    );
    
  return api;
};


