"use strict";
var MongoService = require("../services/MongoService");
var log4js = require("log4js");
var userModel = require("../entity/mongoModels/userModel");
var candidateModel = require('../entity/mongoModels/candidatesModel');
var mongoose = require('mongoose');
var logger = log4js.getLogger('dbController');
var dbUser = new MongoService.MongoService(userModel),
    dbCandidate = new MongoService.MongoService(candidateModel);

var DbController = function () {
};

DbController.prototype.getUserById = function (id) {
    return dbUser.findById(id);
};

DbController.prototype.createNewUser = function (user) {
    if (user.password) {
        var u = new userModel();
        user.password = u.generateHash(user.password);
        logger.info(u);
    }
    return dbUser.create(user);
};

DbController.prototype.getUser = function (user) {
    return dbUser.findOne(user);
};

DbController.prototype.getAllUsers = function () {
    return dbUser.find({});
};

DbController.prototype.setVote = function (clientId, candidateId) {
    return dbUser.findByIdAndUpdate(clientId, {$set: {vote: new mongoose.Types.ObjectId(candidateId)}});
};

DbController.prototype.addCandidate = function (candidate) {
    return dbCandidate.create(candidate);
};

DbController.prototype.getCandidates = function () {
    var args = [
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "vote",
                as: "cliArr"
            }
        },
        {
            $project: {
                name: 1,
                numOfVotes: {$size: "$cliArr"}
            }
        },
        {
            $sort: {numOfVotes: -1}
        }
    ];
    return dbCandidate.aggregate(args);
};
var dbController = new DbController();
module.exports = dbController;
