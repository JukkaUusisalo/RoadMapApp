var assert = require('assert');
var status = require('http-status');
var superagent = require('superagent');
var common = require('../test-common');

var URL_ROOT = common.URL_ROOT;

// Make models available in tests
var Project = common.Project;  

var testProject = {
  'name':'TestProject'
};

it('can get project', function(done) {
    var url = URL_ROOT + '/project';
    superagent.get(url, function(error, res) {
        assert.ifError(error);

        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).projects;
        });
        assert.equal(result.length, 3);        
        done();
    });    
});

it('can create project', function(done) {
    var url = URL_ROOT + '/project';
    superagent
        .post(url)
        .send(testProject)
        .end(function(error, res) {
            assert.ifError(error);
            assert.equal(res.status, 200);
            assert.equal(res.body.project.name,'TestProject');
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

it('Can retrieve project by name', function(done){
    var url = URL_ROOT + '/project/Dev+Project+1';
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).project;
        });
        assert.notEqual(result,null);
        assert.equal(result.name,"Dev Project 1");            
        done();
    });        
});
    
it('Can update project', function(done){
    var url = URL_ROOT + '/project/Dev+Project+1';
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).project;
        });
        assert.notEqual(result,null);
        assert.equal(result.name,"Dev Project 1");   
        result.size = 25;
        superagent
        .put(url)
        .send(result)
        .end(function(error, res) {
            assert.ifError(error);
            assert.equal(res.status, 200);

            Project.findOne({ 'name': 'Dev Project 1' }, 'size', function (err, project) {
                assert.ifError(err);
                assert.equal(25,project.size); 
                done();
            });

        });   
    });        
});
    
it('Can delete project', function(done) {
   var url = URL_ROOT + '/project/Dev+Project+1';
   superagent.del(url)
   .end(function(err,res) {
       assert.ifError(err);
       assert.equal(res.status, 200);
       Project.findOne({'name':'Dev Project 1'},'name',function (err, project){
           assert.ifError(err);
           assert.equal(project,null);
           done();
       });
   });
});   




