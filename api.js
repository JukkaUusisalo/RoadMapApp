var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());

  api.put('/me/cart', wagner.invoke(function(User) {
    return function(req, res) {
      try {
        var cart = req.body.data.cart;
      } catch(e) {
        return res.
          status(status.BAD_REQUEST).
          json({ error: 'No cart specified!' });
      }

      req.user.data.cart = cart;
      req.user.save(function(error, user) {
        if (error) {
          return res.
            status(status.INTERNAL_SERVER_ERROR).
            json({ error: error.toString() });
        }
        return res.json({ user: user });
      });
    };
  }));

  api.get('/me', function(req, res) {
    if (!req.user) {
      return res.
        status(status.UNAUTHORIZED).
        json({ error: 'Not logged in' });
    }

    req.user.populate(
      { path: 'data.cart.product', model: 'Product' },
      handleOne.bind(null, 'user', res));
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
        findOneAndUpdate(query,userData,options)
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

  
  
  api.get('/team', wagner.invoke(function(Team) {
    return function(req, res) {
      Team.
        find({}).
        sort({ name: 1 }).
        exec(function(error, teams) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ teams: teams });
        });
    };
  }));
  
    api.get('/project', wagner.invoke(function(Project) {
    return function(req, res) {
      Project.
        find({}).
        sort({ name: 1 }).
        exec(function(error, projects) {
          if (error) {
            return res.
              status(status.INTERNAL_SERVER_ERROR).
              json({ error: error.toString() });
          }
          res.json({ projects: projects });
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


function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
