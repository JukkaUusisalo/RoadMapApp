var mongoose = require('mongoose');
var _ = require('underscore');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/roadmapapp');

  var Team =
    mongoose.model('Team', require('./team'), 'teams');
  var Project =
    mongoose.model('Project', require('./project'), 'projects');
  var User =
    mongoose.model('User', require('./user'), 'users');

  var models = {
    Team: Team,
    Project: Project,
    User: User
  };

  // To ensure DRY-ness, register factories in a loop
  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });

  return models;
};
