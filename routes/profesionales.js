const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const PROFESIONALES_SERVICE = 'profesionalesService';

//devuelve todos los profesionales registrados en la base
router.get('/', asyncHandler(async (req, res) => {
  res.send(await res.app.get(PROFESIONALES_SERVICE).getAll());
}));
//Devuelve  la foto, nombre y id de los 10 profesionales con mayor valoracion
router.get('/profesionalesTop', asyncHandler(async (req, res) => {
  res.send(await res.app.get(PROFESIONALES_SERVICE).getAllTop());
}));
//Devuelve la informacion de un solo profesional
router.get('/profesional', asyncHandler(async (req, res) => {
  const response = await res.app.get(PROFESIONALES_SERVICE).getById(req.query.id);
  if (response) {
    res.send(response);
  } else {
    res.sendStatus(404);
  }
}));
//Devuelve los profesionales filtrado por el departamento
router.get('/proByDepart', asyncHandler(async (req, res) => {
  const response = await res.app.get(PROFESIONALES_SERVICE).getByUbicacion (req.query.departamento);
  if (response) {
    res.send(response);
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
