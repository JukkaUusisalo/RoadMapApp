/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');


module.exports = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        max: 100,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    }
});

module.exports.set('toObject', { virtuals: true });
module.exports.set('toJSON', { virtuals: true });



