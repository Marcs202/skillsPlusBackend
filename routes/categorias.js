const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const CATEGORIAS_SERVICE = 'categoriasService';

//obtiene todas las categorias
router.get('/', asyncHandler(async (req, res) => {
    res.send(await res.app.get(CATEGORIAS_SERVICE).getAll());
}));

module.exports = router;