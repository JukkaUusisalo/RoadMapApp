var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');
var _ = require('underscore');

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
    
    api.get('/project/:projectName', wagner.invoke(function(Project) {
        return function(req, res) {
            Project.
            findOne({'name':req.param.projectName})
            .exec(function(error, project) {
                if (error) {
                    return res.
                           status(status.INTERNAL_SERVER_ERROR).
                           json({ error: error.toString() });
                }
            res.json({ project: project });
            });
        };   
    }));
  
    api.put('/project/:projectName', wagner.invoke(function(Project) {
        return function(req, res) {
            var projectData = req.body;
            var query = {'name':req.param.projectName};            
            Project
            .findOne(query)
            .exec(function(error, project) {
            if (error) {
                return res
                       .status(status.INTERNAL_SERVER_ERROR)
                       .json({ error: error.toString() });
            }
            if(project) {
                project = _.extend(project,projectData);
                project.save(function (err, updatedProject, numAffected) {
                    if (err) {
                        return res.
                               status(status.INTERNAL_SERVER_ERROR).
                               json({ error: err.toString() });
                    }
                    return res.json({ project: updatedProject });
              });
            
            } else {
                return res.status(status.NOT_FOUND).json({error:'Project not found'});  
            }
            });
        };   
    }));
  
    api.delete('/project/:projectName', wagner.invoke(function(Project) {
        return function(req, res) {
            var query = {'name':req.param.projectName};
            Project
            .findOneAndRemove(query)
            .exec(function(error, project) {
                if (error) {
                    return res
                           .status(status.INTERNAL_SERVER_ERROR)
                           .json({ error: error.toString() });
                }
                if(project) {
                    return res.json({ project: project });
                } else {
                    return res.status(status.NOT_FOUND).json({error:'Project not found'});  
                }
            });
        };   
    }));

  
    api.post('/project', wagner.invoke(function(Project) {
        return function(req, res) {
            var projectData;
            try {
                projectData = req.body;
            } catch(e) {
                return res.status(status.BAD_REQUEST).json({ error: 'Bad Request. Maybe missing body!' });
            }
            var t = new Project(projectData);
            t.save(function(err) {
                if (err) {
                    return res.status(status.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
                }                
            });  
            return res.json({ project: projectData });
            };
        })
    );
  
    return api;
};


