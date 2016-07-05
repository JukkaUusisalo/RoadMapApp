var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
    var api = express.Router();

    api.use(bodyparser.json());
    
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
  
    return api;
};


