var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var exphbs  = require('express-handlebars');
var hbs = exphbs.create({ /* config */ });


var index = require('./routes/index');
var about = require('./routes/about');
var timeline = require('./routes/timeline');
var blogs = require('./routes/blogs');
var links = require('./routes/links');

var app = express();

// view engine setup
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/me', about);
app.use('/timeline', timeline);
app.use('/blogs', blogs);
app.use('/links', links);

module.exports = app;
