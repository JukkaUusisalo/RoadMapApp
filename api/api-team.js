var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

module.exports = function(wagner) {
    var api = express.Router();

    api.use(bodyparser.json());
  
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
  
    api.get('/team/:teamName', wagner.invoke(function(Team) {
        return function(req, res) {
            Team.
            findOne({'name':req.params.teamName})
            .exec(function(error, team) {
                if (error) {
                    return res.
                           status(status.INTERNAL_SERVER_ERROR).
                           json({ error: error.toString() });
                }
            res.json({ team: team });
            });
        };   
    }));
  
    api.put('/team/:teamName', wagner.invoke(function(Team) {
        return function(req, res) {
            var teamData = req.body;
            var query = {'name':req.param.teamName};            
            Team
            .findOne(query)
            .exec(function(error, team) {
            if (error) {
                return res
                       .status(status.INTERNAL_SERVER_ERROR)
                       .json({ error: error.toString() });
            }
            if(team) {
                team = _.extend(team,teamData);
                team.save(function (err, updatedTeam, numAffected) {
                    if (err) {
                        return res.
                               status(status.INTERNAL_SERVER_ERROR).
                               json({ error: err.toString() });
                    }
                    return res.json({ team: updatedTeam });
              });
            
            } else {
                return res.status(status.NOT_FOUND).json({error:'Team not found'});  
            }
            });
        };   
    }));
  
    api.delete('/team/:teamName', wagner.invoke(function(Team) {
        return function(req, res) {
            var query = {'name':req.param.teamName};
            Team
            .findOneAndRemove(query)
            .exec(function(error, team) {
                if (error) {
                    return res
                           .status(status.INTERNAL_SERVER_ERROR)
                           .json({ error: error.toString() });
                }
                if(team) {
                    return res.json({ team: team });
                } else {
                    return res.status(status.NOT_FOUND).json({error:'Team not found'});  
                }
            });
        };   
    }));

  
    api.post('/team', wagner.invoke(function(Team) {
        return function(req, res) {
            var teamData;
            try {
                teamData = req.body;
            } catch(e) {
                return res.status(status.BAD_REQUEST).json({ error: 'Bad Request. Maybe missing body!' });
            }
            var t = new Team(teamData);
            t.save(function(err) {
                if (err) {
                    return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
                }                
            });  
            return res.json({ team: teamData });
            };
        })
    );  
  

    
  return api;
};


