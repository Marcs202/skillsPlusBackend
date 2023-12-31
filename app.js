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
const serviciosRoutes = require('./routes/servicios');
const ServiciosService= require('./services/servicios-service');
const usuariosRoutes = require('./routes/usuarios');
const UsuariosServices = require('./services/usuarios-service');
const contratacionesRoutes= require('./routes/contrataciones');
const ContratacionesServices=require('./services/contrataciones-service');
const app = express();
const fileUpload = require('express-fileupload');
//app.set("port",3000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.timeout = 120000;

app.use(fileUpload({
  useTempFiles:true,
  tempFileDir: path.join(__dirname, 'uploads'),
  createParentPath: true
}));
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
app.use('/usuarios',usuariosRoutes);
app.use('/contrataciones',contratacionesRoutes);
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
UsuariosServices.init().then((usuariosService)=>{
  app.set('usuariosService',usuariosService);
});
process.on('exit', () => {
  app.get('usuariosService').closePool();
});
ContratacionesServices.init().then((contratacionesService)=>{
  app.set('contratacionesService',contratacionesService);
});
process.on('exit', () => {
  app.get('usuariosService').closePool();
});
module.exports = app;
