var assert = require('assert');
var express = require('express');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');
var common = require('./test-common');


function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}



describe('RoadMapApp API', function() {
  var server;
  var Team;
  var Project;
  var User;


  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./models')(wagner);

    // Make models available in tests
    common.Team = models.Team;
    common.Project = models.Project;
    common.User = models.User;
    Team = common.Team;
    Project = common.Project;
    User = common.User;

    app.use(function(req, res, next) {
      User.findOne({}, function(error, user) {
        assert.ifError(error);
        req.user = user;
        next();
      });
    });

    app.use(require('./api')(wagner));

    server = app.listen(3000);
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Team.remove({}, function(error) {
      assert.ifError(error);
      Project.remove({}, function(error) {
        assert.ifError(error);
        User.remove({}, function(error) {
          assert.ifError(error);
          done();
        });
      });
    });
  });

  beforeEach(function(done) {
    var teams = [
      { name: 'Team 1' },
      { name: 'Team 2' }
    ];

    var projects = [
      {
        name: 'Dev Project 1'
      },
      {
        name: 'Dev Project 2'
      },
      {
        name: 'Meaning of Life'
      }
    ];

    var users = [{
      profile: {
        username: 'jukka',
        email: 'jukka@foo.bar'
      }
    }];

    Team.create(teams, function(error) {
      assert.ifError(error);
      Project.create(projects, function(error) {
        assert.ifError(error);
        User.create(users, function(error) {
          assert.ifError(error);
          done();
        });
      });
    });
  });
   
    importTest("User Rest Api","./test/test-user.js");
    importTest("Team Rest Api", './test/test-team.js');
    importTest("Project Rest Api", './test/test-project.js');
});
