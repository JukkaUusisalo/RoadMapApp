/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var User = require('./user');
var Project = require('./project');

var precisions = "Half Quarter Monthly".split(' ');

module.exports = new mongoose.Schema({
    name: {
        type: String
    },
    numberOfParallelProjects: {
        type: Number
    },
    roadMapPrecision: {
        type: String,
        enum: precisions
    },
    users : [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
    }],
    adminUsers : [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
    }],
    projects : [{
            project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Project
            }
    }]
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });



