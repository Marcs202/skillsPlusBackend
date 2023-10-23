const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const SERVICIOS_SERVICE = 'serviciosService';

//obtener todos los servicios 
router.post('/', asyncHandler(async (req, res) => {
  res.status(201).send(await res.app.get(SERVICIOS_SERVICE).postServicio(req.body));
}));

module.exports = router;