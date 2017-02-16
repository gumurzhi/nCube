"use strict";
var log4js = require('log4js');
var logger = log4js.getLogger('restController');
var Q = require('q');
var dbController = require('./dbController');

var RestController = function () {

};

RestController.prototype.register = function (req, res) {
    logger.debug('got register request, body:', req.body);
    dbController.createNewUser(req.body)
    .then(function(user){
       logger.debug('user created:', JSON.stringify(user));
        res.json('ok');
    })
    .catch(function(err){
        logger.error(err);
        res.writeHead(500);
        res.end();
    });
};

RestController.prototype.addCandidate = function (req, res) {
    logger.debug('addCandidate got:', req.body);
    dbController.addCandidate(req.body)
    .then(function(can){
       logger.info('candidate created', can);
        res.json(can);
    })
    .catch(function(err){
        logger.error(err);
        res.writeHead(500);
        res.end();
    });
};

RestController.prototype.addVote = function (req, res) {
  logger.info(req.body);
    logger.trace(req.user);
    dbController.setVote(req.user._id, req.body.candidateId)
    .then(function(user){
       logger.warn(user);
        res.json('OK');
    })
    .catch(function(err){
        logger.error(err);
        res.writeHead(500);
        res.end();
    });
};

RestController.prototype.getAllCandidates = function (req, res) {
  dbController.getCandidates()
    .then(function(canArr){
       res.json(canArr);
    })
    .catch(function(err){
        logger.error(err);
        res.writeHead(500);
        res.end();
    });
};
var restController = new RestController();
module.exports = restController;