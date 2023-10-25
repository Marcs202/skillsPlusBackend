const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const SERVICIOS_SERVICE = 'serviciosService';
const { uploadImage } = require('../services/bucket');
/*const { extname } = require('path');
const MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const multer = require('multer');
const multerUpload = multer({
    limits: {
        fieldSize: 10 * 1024 *1024,
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
});*/

/*
async function subirArchivoABucket(req) {
    const objectCommon = new common.ConfigFileAuthenticationDetailsProvider();//esta reconoce el config como esta en la ubicacion por defecto no se ingresa
    const objectStorageClient = new objectStorage.ObjectStorageClient({ authenticationDetailsProvider: objectCommon });//crea la conexion object cloud
    const bucketName = 'skillsImages';
    const objectName = req.file.filename;
    const filePath = req.file.path;
    const stream = require('fs').createReadStream(filePath);
    const putObjectRequest = {
        namespaceName: 'axjm5wci2rqn',
        bucketName: bucketName,
        objectName: objectName,
        putObjectBody: stream,
        contentLength: fs.statSync(filePath).size,
        contentType: req.file.mimetype
    };
    const urlImagen = `https://axjm5wci2rqn.objectstorage.mx-queretaro-1.oci.customer-oci.com/n/axjm5wci2rqn/b/skillsImages/o/${objectName}`;
    let connection;
    try {

        await objectStorageClient.putObject(putObjectRequest);
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo local:', err);
                } else {
                    console.log('Archivo local eliminado con éxito.');
                }
            });
        }
        let titulo = req.body.titulo;
        let descripcion = req.body.descripcion;
        let profesionalId = parseInt(req.body.profesionalId, 10);
        let query = `
            insert into SERVICIOS (TITULO,FOTO,DESCRIPCION,PROFESIONAL_ID)
            VALUES (:titulo,:urlImagen,:descripcion,:idProfesional)
            `;
        connection = await oracledb.getConnection();
        const result = await connection.execute(query, [titulo, urlImagen, descripcion, profesionalId], { autoCommit: true });

        //res.json({ message: 'Archivo subido con éxito', url: urlImagen });
    } catch (error) {
        console.error('Error al subir el objeto:', error);
        //res.status(500).json({ error: 'Error al subir el archivo' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }

    return urlImagen;
}*/
/*
router.post('/', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No se encontraron archivos para cargar.');
    }

    const archivoCargado = req.files.image; // 'archivo' debe coincidir con el nombre del campo de entrada en tu formulario HTML
    if (!archivoCargado) {
        return res.status(400).send('No se ha cargado ningún archivo.');
    }
    // Verifica que el archivo sea de tipo MIME permitido
    if (!['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(archivoCargado.mimetype)) {
        return res.status(400).send('Tipo de archivo no permitido.');
    }

    // Conserva el nombre original del archivo
    const nombreOriginal = archivoCargado.name;

    // Agrega una marca de tiempo al nombre del archivo (AAAAMMDDHHMMSS)
    const fechaActual = new Date();
    const marcaDeTiempo = fechaActual.toISOString().replace(/[-:TZ.]/g, '');
    const extension = path.extname(nombreOriginal); // Obtén la extensión del archivo original
    const nombreUnico = `${nombreOriginal}${marcaDeTiempo}${extension}`;
    // No es necesario especificar la ubicación al mover el archivo
    archivoCargado.mv(path.join('./uploads', nombreUnico), (err) => {
        if (err) {
          return res.status(500).send(err);
        }

        res.send('Archivo cargado con éxito.');
    });
});*/

// Configuración de OCI

// Configuración de Multer


// router.post('/upload', (req, res,next) => {
//     const upload = multer({ storage: multer.memoryStorage() }).single('image');

//     upload(req, res, async function(err) {
//         if (err instanceof multer.MulterError) {
//             // Ocurrió un error de Multer
//             return res.status(500).json(err);
//         } else if (err) {
//             // Ocurrió un error desconocido
//             return res.status(500).json(err);
//         }

//         // Crear el objeto PutObjectRequest
//         const putObjectRequest = {
//             namespaceName: namespaceName,
//             bucketName: bucketName,
//             objectName: req.file.originalname,
//             putObjectBody: req.file.buffer,
//             contentLength: req.file.size
//         };

//         // Subir la imagen al bucket
//         try {
//             const response = await client.putObject(putObjectRequest);
//             res.send('Upload successful');
//         } catch (error) {
//             console.error('Error during upload:', error);
//             res.status(500).send('Upload failed');
//         }
//     });
// });
router.post('/upload', async (req, res) => {
    try {
        const url = await uploadImage(req.files.image,res);
        res.json({ message: `Se subió un archivo temp, la URL es ${url}` });
    } catch (error) {
        res.status(500).json({ error: 'Error al subir el archivo al bucket' });
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