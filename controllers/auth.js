"use strict";
var passport = require('passport');
var log4js = require('log4js');
var logger = log4js.getLogger('auth');

var Auth = function () {
};

Auth.prototype.login = function (req, res, next) {
    passport.authenticate('local-login', function (err, user, info) {
        if (err) {
            logger.error(err);
            return next(err);
        }
        if (!user) {
            logger.error('there are no such user');
            return res.json({ error: 'wrong username or password' });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.json('loggedIn');
        });
    })(req, res, next);
};

Auth.prototype.logout = function(req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
};
var auth = new Auth();
module.exports = auth;

