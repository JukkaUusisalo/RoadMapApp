var assert = require('assert');
var express = require('express');
var status = require('http-status');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';
var PRODUCT_ID = '000000000000000000000001';

describe('Product API', function() {
  var server;
  var Team;
  var Project;
  var User;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('./models')(wagner);

    // Make models available in tests
    Team = models.Team;
    Project = models.Project;
    User = models.User;

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
        name: 'Meaning of Life',
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

  it('can get users', function(done) {
    var url = URL_ROOT + '/user';
    superagent.get(url, function(error, res) {
        assert.ifError(error);

        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).user;
        });
        assert.equal(result.length, 1);
        done();
    });
  });
  
  it('can get teams', function(done) {
    var url = URL_ROOT + '/team';
    superagent.get(url, function(error, res) {
        assert.ifError(error);

        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).team;
        });
        assert.equal(result.length, 2);
        done();
    });
  });
  
    it('can get project', function(done) {
    var url = URL_ROOT + '/project';
    superagent.get(url, function(error, res) {
        assert.ifError(error);

        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).project;
        });
        assert.equal(result.data.cart.length, 3);
        done();
    });
  });

});
