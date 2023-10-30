const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const SERVICIOS_SERVICE = 'serviciosService';
const {uploadFile}=require('../services/s3')
router.post('/uplToAWS', async (req, res) => { //este medoto solo sube la imagen
    try {
        const url = await uploadFile(req.files.image,res);
        res.json({ message: `Se subió un archivo temp, la URL es ${url}` });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir el archivo al bucket' });
    }
});
router.post('/upload', async (req, res) => {
    try {
        await res.app.get(SERVICIOS_SERVICE).postServicioAWS(req,res,req.files.image);
    } catch (error) {
        console.log(error);
    }
});
router.get('/', asyncHandler(async (req, res) => {
    const response = await res.app.get(SERVICIOS_SERVICE).getByIdProfesional(req.query.idProfesional);
    if (response) {
        res.send(response);
    } else {
        res.sendStatus(404);
    }
}));
router.put('/inactivar', asyncHandler(async (req, res) => {
    res.status(201).send(await res.app.get(SERVICIOS_SERVICE).inactivarServicio(req.body));
}));
router.put('/editar', asyncHandler(async (req, res) => {
    res.status(201).send(await res.app.get(SERVICIOS_SERVICE).editarServicio(req.body));
}));
module.exports = router;