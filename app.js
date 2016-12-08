require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const aws = require('aws-sdk')

var routes = require('./routes/index');
var users = require('./routes/user');
var dashboard = require('./routes/dashboard');
var items = require('./routes/items')

var app = express();
var passport = require('passport');
var flash = require('connect-flash');
require('./config/passport')(passport);

var session = require('express-session');

const S3_BUCKET = process.env.S3_BUCKET;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport stuff
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


app.get('/sign-s3', (req, res) => {

    const s3 = new aws.S3({
        region: 'us-west-2',
    });
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {

        if (err) {
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });
});


app.use('/', routes);
app.use(function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    };
    res.redirect('/');
});
app.use('/user', users);
app.use('/dashboard', dashboard);
app.use('/items', items);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('static/error', {
            message: err.message,
            error: err,
            user: req.user
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('static/error', {
        message: err.message,
        error: {},
        user: req.user
    });
});

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = app;