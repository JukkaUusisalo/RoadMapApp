
var assert = require('assert');
var status = require('http-status');
var superagent = require('superagent');
var common = require('../test-common');

var URL_ROOT = common.URL_ROOT;

// Make models available in tests
var Team = common.Team;

var testTeam = {
  'name':'TestTeam',
  'numberOfParallelProjects':4,
  'roadMapPrecision':'Quarter'
};

it('can get teams', function(done) {
    var url = URL_ROOT + '/team';
    superagent.get(url, function(error, res) {
        assert.ifError(error);

        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).teams;
        });
        assert.equal(result.length, 2);        
        done();
    });    
});

it('can create team', function(done) {
    var url = URL_ROOT + '/team';
    superagent
        .post(url)
        .send(testTeam)
        .end(function(error, res) {
            assert.ifError(error);
            assert.equal(res.status, 200);
            assert.equal(res.body.team.name,'TestTeam');
            done();           
    });
 // Have not idea why find below does not found user?
 /*User.findOne({'profile.username': "TestUser"}, 'profile', function (err, user) {
    assert.ifError(err);
    assert.notEqual(user,null);
    assert.equal(user.profile.email,"test@email.com");
    done();
    }); */ 
});

it('Can retrieve team by name', function(done){
    var url = URL_ROOT + '/team/Team 1';
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).team;
        });
        assert.equal(result.team.name,"Team 1");            
        done();
    });        
});
    
it('Can update team', function(done){
    var url = URL_ROOT + '/team/Team 1';
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).team;
        });
        assert.equal(result.team.name,"Team 1");   
        result.numberOfParallelProjects = 2;
        superagent
        .put(url)
        .send(result)
        .end(function(error, res) {
            assert.ifError(error);
            assert.equal(res.status, 200);

            Team.findOne({ 'name': 'Team 1' }, 'numberOfParallelProjects', function (err, team) {
                assert.ifError(err);
                assert.equal(2,team.numberOfParallelProjects); 
                done();
            });

        });   
    });        
});
    
it('Can delete team', function(done) {
   var url = URL_ROOT + '/team/Team 1';
   superagent.del(url)
   .end(function(err,res) {
       assert.ifError(err);
       assert.equal(res.status, 200);
       Team.findOne({'name':'Team 1'},'profile',function (err, user){
           assert.ifError(err);
           assert.equal(user,null);
           done();
       });
   });
});   



