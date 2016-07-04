var assert = require('assert');
var status = require('http-status');
var superagent = require('superagent');
var common = require('../test-common');

var URL_ROOT = common.URL_ROOT;

// Make models available in tests
var Project = common.Project;  

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



