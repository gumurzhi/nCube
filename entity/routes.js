"use strict";
var auth = require('../controllers/auth');
var restController = require('../controllers/restController');
module.exports = [
    {
        path: '/',
        httpMethod: 'GET',
        authToUse: false,
        middleware: [function (req, res, next) {
                res.render('index');
            }]
    },
    {
        path: '/login',
        httpMethod: 'GET',
        authToUse: false,
        middleware: [function (req, res, next) {
            res.render('login.jade');
        }]
    },
    {
        path: '/login',
        httpMethod: 'POST',
        authToUse: false,
        middleware: [auth.login]
    },
    {
        path: '/user/add',
        httpMethod: 'POST',
        authToUse: false,
        middleware: [function (req, res) {
            restController.register(req, res);
        }]
    },
    {
        path: '/candidate/add',
        httpMethod: 'POST',
        authToUse: false,
        middleware: [function (req, res) {
            restController.addCandidate(req, res);
        }]
    },
    {
        path: '/candidate/getAll',
        httpMethod: 'GET',
        authToUse: false,
        middleware: [function (req, res) {
            restController.getAllCandidates(req, res);
        }]
    },
    {
        path: '/user/addVote',
        httpMethod: 'POST',
        authToUse: 'isLoggedIn',
        middleware: [function (req, res) {
            restController.addVote(req, res);
        }]
    },
    {
        path: '/logout',
        httpMethod: 'GET',
        authToUse: false,
        middleware: [auth.logout]
    }

];
