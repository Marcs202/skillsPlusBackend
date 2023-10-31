const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const DEPARTAMENTOS_SERVICE = 'departamentosService';

//obtiene todas las categorias
router.get('/', asyncHandler(async (req, res) => {
    res.send(await res.app.get(DEPARTAMENTOS_SERVICE).getAll());
}));

module.exports = router;