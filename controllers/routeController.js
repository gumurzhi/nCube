"use strict";
var routes = require('../entity/routes');
module.exports = function (app) {
    routes.forEach(function (route) {
        if (route && route.authToUse) {
            route.middleware.unshift(isLoggedIn);
        }

        var args = flatten([route.path, route.middleware]);
        switch (route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
        }
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.json({error: 'not authenticated'});
}
function flatten(arr) {
    var _a;
    var flat = (_a = []).concat.apply(_a, arr);
    return flat.some(Array.isArray) ? flatten(flat) : flat;
}
