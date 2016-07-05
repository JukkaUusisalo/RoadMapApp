var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

// Make models available in tests
var models = require('./models')(wagner);
var Team = models.Team;
var Project = models.Project;
var User = models.User;

exports.URL_ROOT = URL_ROOT;
exports.Team = Team;
exports.Project = Project;
exports.User = User;


