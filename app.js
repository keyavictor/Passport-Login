var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');



const sequelize = require('./config/database'); // Ensure correct path to your database configuration
const User = require('./models/User'); // Ensure correct path to the User model


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

/*
(async () => {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` ensures the table is updated without dropping it
    console.log('Database synchronized and tables ensured.');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
})();*/

app.use('/', indexRouter);
app.use('/api', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
