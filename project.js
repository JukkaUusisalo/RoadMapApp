/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var User = require('./user');

var precisions = "Half Quarter Monthly".split(' ');

module.exports = new mongoose.Schema({
    name: {
        type: String
    },
    size: {
        type: Number,
        max: 100
    }
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });



