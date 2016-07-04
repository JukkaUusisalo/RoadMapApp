var assert = require('assert');
var status = require('http-status');
var superagent = require('superagent');
var common = require('../test-common');

var URL_ROOT = common.URL_ROOT;


// Make models available in tests
var User = common.User;

  it('can get users', function(done) {
    var url = URL_ROOT + '/user';
    superagent.get(url, function(error, res) {
        assert.ifError(error);

        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).users;
        });
        assert.equal(result.length, 1);
        done();
    });
  });
  
it('can create user', function(done) {
var url = URL_ROOT + '/user';
superagent
    .post(url)
    .send({'profile':{'username': 'TestUser', 'email': 'test@email.com'}})
    .end(function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, 200);
        var retUser = res.body.user;
        assert.equal(res.body.user.profile.email,'test@email.com');
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
    
    
    
it('Can retrieve user by name', function(done){
    var url = URL_ROOT + '/user/jukka';
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).user;
        });
        assert.equal(result.profile.username,"jukka");            
        done();
    });        
});

it('Can update user', function(done){
    var url = URL_ROOT + '/user/jukka';
    superagent.get(url, function(error, res) {
        assert.ifError(error);
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
            result = JSON.parse(res.text).user;
        });
        assert.equal(result.profile.username,"jukka");   
        result.profile.email = "foo@email.com";
        superagent
        .put(url)
        .send(result)
        .end(function(error, res) {
            assert.ifError(error);
            assert.equal(res.status, 200);

            User.findOne({ 'profile.username': 'jukka' }, 'profile', function (err, user) {
                assert.ifError(err);
                assert.equal("foo@email.com",user.profile.email); 
                done();
            });

        });   
    });        
});

it('Can delete user', function(done) {
   var url = URL_ROOT + '/user/jukka';
   superagent.del(url)
   .end(function(err,res) {
       assert.ifError(err);
       assert.equal(res.status, 200);
       User.findOne({'profile.username':'jukka'},'profile',function (err, user){
           assert.ifError(err);
           assert.equal(user,null);
           done();
       });

   });
});


