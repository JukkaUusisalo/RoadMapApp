var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

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
  

    
  return api;
};


