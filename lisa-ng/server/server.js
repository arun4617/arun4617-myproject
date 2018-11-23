/*
* This file script start a server and listens on port 3000 for connections
* Ref: https://github.com/OfficeDev/Office-Add-in-Nodejs-ServerAuth
*/
require('rootpath')();
var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var path            = require('path');
var http            = require('http');
var utils           = require('./helpers/utils.js');
var environment     = process.env.NODE_ENV;
var jwt             = require('jsonwebtoken');
var ONE_DAY_MILLIS  = 86400000;
var GoogleStrategy  = require('passport-google-oauth').OAuth2Strategy;
var passport        = require('passport');
var session         = require('express-session');
var googleConfig    = require('./helpers/setting').googleConf;
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var fs              = require('fs');
var setting         = require('./helpers/setting');
//=================Create server ================//
console.log("setting", setting.SITEURL);
const port = process.env.PORT || '3000';
var server = null;

if(process.env.NODE_ENV == "vpn-node-dev" || process.env.NODE_ENV == "vpn-ng-dev"){
  server = require('https').createServer({
    key: fs.readFileSync('./helpers/certs/server.key'),
    cert: fs.readFileSync('./helpers/certs/server.crt'),
    requestCert: false,
    rejectUnauthorized: false
  },app);
}else{
  server = http.createServer(app);
}

server.listen(port, () => console.log(`Running on localhost:${port}, for environment:${process.env.NODE_ENV}`));
//======================================//

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Google profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// allow cross origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", "https://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Tell passport how to use Google 
passport.use(new GoogleStrategy(googleConfig, utils.verifyGoogle));

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  name: 'nodecookie',
  cookie: {
    path: '/',
    httpOnly: false,
    secure: false,
    maxAge: 7 * ONE_DAY_MILLIS
  },
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'dist')));

// routes
app.use('/api/google-auth', require('./controllers/google-auth.controller'));

app.get('/*', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});
 
module.exports = app;
