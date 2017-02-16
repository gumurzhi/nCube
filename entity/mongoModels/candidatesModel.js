"use strict";
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
   name: {required: true, type: String, unique: true}
});

module.exports = mongoose.model('candidates', schema);
