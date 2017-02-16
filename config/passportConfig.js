"use strict";
var dbController = require('../controllers/dbController');
var LocalStrategy = require('passport-local').Strategy;
var log4js = require('log4js');
var logger = log4js.getLogger('passportConfig');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        logger.debug('it\'s a user:', user);
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        dbController.getUserById(id)
            .then(function (user) {
                done(null, user);
            })
            .catch(function (err) {
                logger.error(err);
                done(err);
            });
    });


    passport.use('local-login', new LocalStrategy(
        function (username, password, callback) {
        dbController.getUser({username: username})
            .then(function (user) {
                if (!user) {
                    return callback(null, false, {message: 'Incorrect username.'});
                }
                else if (!bcrypt.compareSync(password, user.password)) {
                    return callback(null, false, {message: 'Incorrect password.'});
                }
                return callback(null, user);
            })
            .catch(function (err) {
                logger.error(err);
                return callback(err);
            });
    }));
};
