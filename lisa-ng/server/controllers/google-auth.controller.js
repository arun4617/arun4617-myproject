/*
* Its required to setup the express route for google authetication using passport.
* For more details: https://github.com/jaredhanson/passport-google-oauth
*/
var setting                 = require('../helpers/setting');
var express                 = require('express');
var router                  = express.Router();
var fs                      = require('fs');
var path                    = require('path');
var passport                = require('passport');
var csrf                    = require('csurf');
var authenticationOptions   = {};
var cookie                  = require('cookie');
var cookieParser            = require('cookie-parser');
var request                 = require('request');

authenticationOptions.google =  { 
                                    session: false, 
                                    scope: ['profile', 'email'],
                                    accessType: 'offline'
                                };
  
router.use(csrf());
// routes
router.get('/connect', connect, passport.authenticate('google', authenticationOptions.google));
router.get('/google/callback', passport.authenticate('google', authenticationOptions.google), authCallback);

module.exports = router;

var response = {};

const clearResponse = () => {
    // Response handling
    response = {
        status: 200,
        data: [],
        message: null
    };
}

// Error handling
const sendError = (err, res) => {
    response.status = 400;
    response.message = err !== null && typeof err === 'object' ? err.message : err;
    res.json(response);
};

function connect(req, res, next){
    // Include the sessionID and csrftToken value in the OAuth state parameter
    authenticationOptions.google.state = req.sessionID + '|' + req.csrfToken();
    res.cookie('CSRF-TOKEN', req.csrfToken());
    next();
}

//handle the authentication callback after redirect from google auth2
function authCallback(req, res){
    if (req.cookies['CSRF-TOKEN'] !== req.user.csrfToken) {
        res.redirect(setting.BASEURL+'/#/login?status=failed');
    }
    var userData = JSON.stringify(req.user);
    res.cookie('authData', userData);
    clearResponse();
    res.redirect(setting.BASEURL+'/#/login?status=success');
}
 