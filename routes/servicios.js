const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const SERVICIOS_SERVICE = 'serviciosService';

//obtener todos los servicios 
router.get('/', asyncHandler(async (req, res) => {
    res.send(await res.app.get(SERVICIOS_SERVICE).getAll());
  }));