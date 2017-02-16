"use strict";
var dbController_1 = require("./dbController");
var log4js_1 = require("log4js");
var Q = require("q");
var userModel_1 = require("../entity/mongoModels/userModel");
var fsController_1 = require("./fsController");
var socketIoController_1 = require("./socketIoController");
//import {advController} from "./advController";
var logger = log4js_1.getLogger('userController');
var UserController = (function () {
    function UserController() {
    }
    UserController.prototype.checkAdminExist = function () {
        dbController_1.dbController.getAllUsers()
            .then(function (users) {
            if (!users || users.length == 0) {
                var admin = new userModel_1.User({
                    username: 'admin', password: 'admin', wallet: 0, profile: {
                        logo: '',
                        name: 'admin',
                        phone: '',
                        url: '',
                        email: '',
                        company: '',
                        location: '',
                        disable_notifications: true
                    }
                });
                admin.password = admin.generateHash(admin.password);
                return dbController_1.dbController.createNewUser(admin);
            }
        })
            .then(function (data) {
            if (data)
                logger.info('admin successfully created');
        })
            .catch(function (err) {
            logger.error(err);
        });
    };
    UserController.prototype.getInfo = function (username) {
        return dbController_1.dbController.getUser({ username: username });
    };
    UserController.prototype.createNewUser = function (user) {
        var deferred = Q.defer();
        if (user && user.username && user.password) {
            dbController_1.dbController.getUser({ username: user.username })
                .then(function (userExist) {
                if (userExist) {
                    deferred.resolve({ error: 'user with such username already exist' });
                }
                else {
                    user.wallet = 0;
                    var newUser = new userModel_1.User(user);
                    newUser.password = newUser.generateHash(newUser.password);
                    return dbController_1.dbController.createNewUser(newUser);
                }
            })
                .then(function (created) {
                if (created)
                    deferred.resolve(created);
            })
                .catch(function (err) {
                logger.error(err);
                deferred.resolve({ error: 'internal server error' });
            });
        }
        return deferred.promise;
    };
    ;
    UserController.prototype.getProfile = function (userId) {
        var deferred = Q.defer();
        dbController_1.dbController.getUserById(userId)
            .then(function (user) {
            if (user)
                deferred.resolve(user.profile);
            else
                deferred.reject({ error: { code: 404, message: 'no such user' } });
        })
            .catch(function (err) {
            logger.error('getProfile Error', err);
            deferred.reject({ error: { code: 500, message: 'internal server error' } });
        });
        return deferred.promise;
    };
    UserController.prototype.setProfile = function (userId, profileObj) {
        var deferred = Q.defer();
        this.perpareProfile(profileObj)
            .then(function (preparedProfile) {
            logger.trace('prepared profile:', preparedProfile);
            return dbController_1.dbController.updateUserById(userId, { $set: { profile: preparedProfile } });
        })
            .then(function (updatedUser) {
            logger.trace('updated User is:', updatedUser);
            if (updatedUser) {
                socketIoController_1.socketIoController.sendUserInfo(updatedUser);
                deferred.resolve(updatedUser.profile);
            }
            else {
                deferred.reject({ error: { code: 404, message: 'no such user' } });
            }
        })
            .catch(function (err) {
            logger.error('setProfile ERROR:', err);
            deferred.reject({ error: { code: 500, message: 'internal server error' } });
        });
        return deferred.promise;
    };
    UserController.prototype.perpareProfile = function (profileObj) {
        var deferred = Q.defer();
        logger.trace('start to prepare profile');
        if (profileObj.logo && typeof profileObj.logo == 'string' && profileObj.logo.search(/data:image\/\w+;base64/) >= 0) {
            fsController_1.fsController.saveToPublic('images', Math.random().toString(36).substring(7), profileObj.logo)
                .then(function (fullPath) {
                logger.debug('logo saved', fullPath);
                if (fullPath)
                    profileObj.logo = fullPath;
                deferred.resolve(profileObj);
            })
                .catch(function (err) {
                logger.error('perpareProfile ERROR:', err);
                deferred.resolve(profileObj);
            });
        }
        else {
            deferred.resolve(profileObj);
        }
        return deferred.promise;
    };
    UserController.prototype.changePassword = function (passwords, userId) {
        var deferred = Q.defer();
        logger.trace('will try to change password');
        dbController_1.dbController.getUserById(userId)
            .then(function (user) {
            if (user) {
                logger.trace('user found');
                var vUser = new userModel_1.User(user);
                if (vUser.validPassword(passwords.old)) {
                    logger.trace('got valid password');
                    var newPassword = vUser.generateHash(passwords.new);
                    return dbController_1.dbController.updateUserById(userId, { $set: { password: newPassword } });
                }
                else {
                    logger.warn('got not valid password');
                    deferred.reject({ error: { code: 200, message: 'password is not valid' } });
                    return deferred.promise;
                }
            }
            else {
                logger.warn('user with id', userId, 'was not found');
                deferred.reject({ error: { code: 404, message: 'no such user' } });
                return deferred.promise;
            }
        })
            .then(function (updatedUser) {
            logger.debug('password was updated:', updatedUser);
            deferred.resolve({ success: true });
        })
            .catch(function (err) {
            logger.error('dbController.getUserById got ERROR:', err);
            deferred.reject({ error: { code: 500, message: 'internal server error' } });
        });
        return deferred.promise;
    };
    return UserController;
}());
exports.userController = new UserController();
//# sourceMappingURL=userController.js.map