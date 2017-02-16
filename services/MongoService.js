"use strict";
///<reference path="../typings/tsd.d.ts"/>
var log4js = require('log4js');
var logger = log4js.getLogger('MongoService');
var Q = require('q');
var mongoose = require('mongoose');
var appConfig = require('../config/appConfig');
mongoose.connect(appConfig.mongoose.uri, appConfig.mongoose.options);
var db = mongoose.connection;

db.on('error', function (err) {
    logger.error("MongoDB connection error", err.message);
});
db.once('open', function callback() {
    logger.info("Connected to MongoDB!");
});
var MongoService = function (newModel) {
    this.model = newModel;
};

MongoService.prototype.find = function (conditions, fields) {
    var deferred = Q.defer();
    this.model.find(conditions, fields, function (err, arr) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(arr.map(function (cell) {
                return JSON.parse(JSON.stringify(cell));
            }));
        }
    });
    return deferred.promise;
};
MongoService.prototype.create = function (obj) {
    var deferred = Q.defer();
    this.model.create(obj, function (err, obj) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(JSON.parse(JSON.stringify(obj)));
        }
    });
    return deferred.promise;
};

MongoService.prototype.fullCycleSearch = function (conditions, fields, sort, limit, skip) {
    var deferred = Q.defer();
    this.model.find(conditions, fields).sort(sort).skip(skip).limit(limit).exec(function (err, arr) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

MongoService.prototype.aggregate = function (aggregateObj) {
    var deferred = Q.defer();
    this.model.aggregate(aggregateObj, function (err, arr) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(arr);
        }
    });
    return deferred.promise;
};

MongoService.prototype.remove = function (conditions) {
    var deferred = Q.defer();
    this.model.remove(conditions, function (err) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve('document deleted');
        }
    });
    return deferred.promise;
};

MongoService.prototype.findById = function (id) {
    var deferred = Q.defer();
    this.model.findById(id).exec(function (err, obj) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(JSON.parse(JSON.stringify(obj)));
        }
    });
    return deferred.promise;
};

MongoService.prototype.findByIdAndUpdate = function (id, newData) {
    var deferred = Q.defer();
    this.model.findOneAndUpdate({_id: id}, newData, {"new": true}, function (err, obj) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(JSON.parse(JSON.stringify(obj)));
        }
    });
    return deferred.promise;
};

MongoService.prototype.findOne = function (conditions, fields) {
    var deferred = Q.defer();
    this.model.findOne(conditions, fields).exec(function (err, obj) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(JSON.parse(JSON.stringify(obj)));
        }
    });
    return deferred.promise;
};

MongoService.prototype.findAndUpdate = function (conditions, newData, options) {
    var deferred = Q.defer();
    if (!options)
        options = {"new": true};
    else
        options.new = true;
    options.versionKey = false;
    this.model.findOneAndUpdate(conditions, newData, options, function (err, obj) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(JSON.parse(JSON.stringify(obj)));
        }
    });
    return deferred.promise;
};

MongoService.prototype.count = function (conditions) {
    var deferred = Q.defer();
    this.model.count(conditions, function (err, count) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(count);
        }
    });
    return deferred.promise;
};
exports.MongoService = MongoService;
