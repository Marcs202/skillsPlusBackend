const oracledb = require('oracledb');
const configuracion = require('../config/config');
const fs = require('fs');
const { extname } = require('path');
const oci = require('oci-sdk');
const common = require('oci-common');
const objectStorage = require('oci-objectstorage');
module.exports = class ServiciosService {
    constructor() { }
    static async init() {
        console.log('Creando pool de conexiones para servicios...');
        const direccion = configuracion.direccion;
        const user = configuracion.user;
        const password = configuracion.password;
        const connectString = configuracion.connectString;

        if (direccion == '') {
            oracledb.initOracleClient();//en el server se deja la variable vacia
        } else {
            oracledb.initOracleClient({ libDir: direccion });
        }
        await oracledb.createPool({
            user: user,
            password: password,
            connectString: connectString,
        });
        console.log('Pool de conexiones creado.')
        return new ServiciosService();
    }
    async postServicio(req, res) {
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
            const result = await connection.execute(query, [titulo, urlImagen, descripcion, profesionalId],{autoCommit:true});
            
            res.json({ message: 'Archivo subido con éxito', url: urlImagen });
        } catch (error) {
            console.error('Error al subir el objeto:', error);
            res.status(500).json({ error: 'Error al subir el archivo' });
        }finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
    async getByIdProfesional(profesionalId) {
        let connection;
        const servicios = [];

        try {
            let query = `
            SELECT s.id,profesional_id , s.titulo, s.foto, s.descripcion from servicios s
            where s.profesional_id = :id`;

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, [profesionalId], { autoCommit: true });
            result.rows.map(servicio => {
                //id, titulo, foto, descripcion, profesionalID
                let schemaProfesional = {
                    "ID_Servicio": servicio[0],
                    "ID_Profesional": servicio[1],
                    "Titulo": servicio[2],
                    "Foto": servicio[3],
                    "Descripcion": servicio[4]
                }
                servicios.push(schemaProfesional);

            });
        } catch (error) {

            console.error(error);
        }
        finally {
            try {
                await connection.close();
            }
            catch (error) {
                console.error(error);
            }
        }
        return servicios;
    }
}