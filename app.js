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
const categoriasRoutes = require('./routes/categorias');
const CategoriasService = require('./services/categorias-service');
const serviciosRoutes = require('./routes/servicios');// si comento este codigo, en el servidor funciona 
const ServiciosService= require('./services/servicios-service');//si comento este, el srvidor funciona
const app = express();
//app.set("port",3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(cors());
app.use(morgan('dev'));

///app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', homeRoutes);
app.use('/profesionales',profesionalesRoutes);
app.use('/categorias',categoriasRoutes);
app.use('/servicios',serviciosRoutes);//tambien comenté este codigo
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
  app.get('profesionalesService').closePool();
});

CategoriasService.init().then((categoriasService)=>{
  app.set('categoriasService',categoriasService);
});
process.on('exit', () => {
  app.get('categoriasService').closePool();
});
//el bloque de abajo
ServiciosService.init().then((serviciosService)=>{
  app.set('serviciosService',serviciosService);
});
process.on('exit', () => {
  app.get('serviciosService').closePool();
});
module.exports = app;
