const {Router} = require ('express');
const router = Router();
const DB = require('../config/config');
const asyncHandler = require('express-async-handler');
const PROFESIONALES_SERVICE = 'profesionalesService';
//un mensaje generico para sa
router.get('/',(req,res)=>{
    res.status(200).json({
        message: "Esta en construccion"//debera enviar toodos los profesionales cargados de la base
    })
});
router.get('/profesionalesTop', asyncHandler(async (req, res) => {
    res.send(await res.app.get(PROFESIONALES_SERVICE).getAllTop());
  }));

module.exports = router;
