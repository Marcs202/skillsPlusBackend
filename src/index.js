const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const router = require('../routes/routes')



app.set("port",3000);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Routes
app.use(router);
/*
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
  });*/ 
  
app.listen(app.get("port"),()=>{
    console.log("server status 200 en el puerto 3000");
});

/*
ClienteService.init().then((clienteService) => {
    app.set('clienteService', clienteService);
  });
  
  process.on('exit', () => {
    app.get('clienteService').closePool();
  });
  
*/
module.exports = app;
