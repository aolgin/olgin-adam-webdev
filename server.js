var express = require('express');
var app = express();

// var session = require('express-session');


var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var secret = process.env.SESSION_SECRET || 'this is a secret';

app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true // if dne, create a new one (rather than use existing)
}));
// The order that this is done is important
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// require("./lectures/mongo/movies")(app);
// require("./lectures/postgres/movies/services/actor.service.server")(app);
// require("./lectures/passportjs/services/user.service.server")(app);
// require('./lectures/ejs/hello');

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// require ("./test/app.js")(app);
var assignment = require("./assignment/app.js");
assignment(app);

var port = process.env.PORT || 3000;

app.listen(port);