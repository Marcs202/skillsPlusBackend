const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const USUARIOS_SERVICE = 'usuariosService';


router.get('/', asyncHandler(async (req, res) => {
  const response = await res.app.get(USUARIOS_SERVICE).getAll();
  if (response) {
    res.send(response);
  } else {
    res.sendStatus(404);
  }
}));
router.get('/usuario', asyncHandler(async (req, res) => {
  const response = await res.app.get(USUARIOS_SERVICE).getById(req.query.id);
  if (response) {
    res.send(response);
  } else {
    res.sendStatus(404);
  }
}));
router.put('/editar', asyncHandler(async (req, res) => {
  res.status(201).send(await res.app.get(USUARIOS_SERVICE).editarUsuario(req.body));

}));

router.post('/login', asyncHandler(async (req, res) => {
  try {
    const resultado = await res.app.get(USUARIOS_SERVICE).iniciarSesion(req.body);
    res.status(201).send(resultado);
  } catch (error) {
    res.status(401).send(error.message);
  }
}));
module.exports = router;