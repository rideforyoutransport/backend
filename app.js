const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
var cors = require('cors');


require('dotenv').config();
const routes = require('./routes');
const cookieParser = require('cookie-parser');

//firebase
const  { initializeApp } = require("firebase/app");
const firebaseConfig = require('./helpers/firebase');
const fireBaseApp = initializeApp(firebaseConfig);

const app = express();

app.use(cors({ origin: true, credentials: true }))
app.use(cookieParser())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'category_images')));
app.use('/api', routes);


// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });
// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
