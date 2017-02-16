"use strict";
var bcrypt = require('bcrypt-nodejs');
var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    password: {required: true, type: String},
    username: {required: true, type: String, unique: true},
    vote: mongoose.Schema.Types.ObjectId
    
});
UserSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('users', UserSchema);

