const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const { extname } = require('path');
const SERVICIOS_SERVICE = 'serviciosService';
const multer = require('multer');
const MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const multerUpload = multer({
    limits: {
        fieldSize: 10000000,
    },
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Solo esta permitido archivos ${MIMETYPES.join('')} tipos permitidos`));
    },
    storage: multer.diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];
            cb(null, `${fileName}-${Date.now()}${fileExtension}`);
        }
    })
});

router.post('/', multerUpload.single('image'), async (req, res) => {
    res.status(201).send(await res.app.get(SERVICIOS_SERVICE).postServicio(req, res));
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