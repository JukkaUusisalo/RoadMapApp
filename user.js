var mongoose = require('mongoose');
var Team = require('./team');

module.exports = new mongoose.Schema({
  profile: {
    username: {
      type: String,
      required: true,
      lowercase: true
    },
    picture: {
      type: String,
      required: false,
      match: /^http:\/\//i
    },
    email: {
      type: String,
      required: true
      //match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/
    },
    passwd: {
        type: String,
        required: false
    }    
  },
  data: {
    teams: [{
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Team
      }
    }]
  }
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });
