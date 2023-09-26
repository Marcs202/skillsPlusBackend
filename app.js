const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const homeRoutes = require('./routes/index')
const profesionalesRoutes = require('./routes/profesionales');
const ProfesionalesService = require('./services/profesionales-service');
const app = express();
//app.set("port",3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', homeRoutes);
app.use('/profesionales',profesionalesRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

ProfesionalesService.init().then((profesionalesService)=>{
  app.set('profesionalesService',profesionalesService);
});
process.on('exit', () => {
  app.get('profesionalesServices').closePool();
});
module.exports = app;
