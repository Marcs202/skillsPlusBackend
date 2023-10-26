const oracledb = require('oracledb');
const configuracion = require('../config/config');
const fs = require('fs');
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
    /*async postServicio(req, res) {
        //solo con insert
        //const urlImagen = `https://axjm5wci2rqn.objectstorage.mx-queretaro-1.oci.customer-oci.com/n/axjm5wci2rqn/b/skillsImages/o/${objectName}`;
        let connection;
        try {
            
            
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
    }*/

    async postServicio(req,res,file){
        const objectCommon = new common.ConfigFileAuthenticationDetailsProvider();//esta reconoce el config como esta en la ubicacion por defecto no se ingresa
        const objectStorageClient = new objectStorage.ObjectStorageClient({ authenticationDetailsProvider: objectCommon });//crea la conexion object cloud
        const bucketName = 'skillsImages';
        const objectName = file.name;
        const stream = fs.createReadStream(file.tempFilePath);
        const putObjectRequest = {
            namespaceName: 'axjm5wci2rqn',
            bucketName: bucketName,
            objectName: objectName,
            putObjectBody: stream,
            contentLength: fs.statSync(file.tempFilePath).size,
            contentType: file.mimetype
        };
        let connection;
        try {
            let titulo = req.body.titulo;
            let descripcion = req.body.descripcion;
            let profesionalId = parseInt(req.body.profesionalId, 10);
            //console.log(putObjectRequest);
            const urlImagen = `https://axjm5wci2rqn.objectstorage.mx-queretaro-1.oci.customer-oci.com/n/axjm5wci2rqn/b/skillsImages/o/${objectName}`;
            const resultado = await objectStorageClient.putObject(putObjectRequest);
            let query = `
                insert into SERVICIOS (TITULO,FOTO,DESCRIPCION,PROFESIONAL_ID)
                VALUES (:titulo,:urlImagen,:descripcion,:idProfesional)
                `;
            connection = await oracledb.getConnection();
            const result = await connection.execute(query, [titulo, urlImagen, descripcion, profesionalId], { autoCommit: true });
            res.status(200).json({url:`Enlace a la imagen ${urlImagen}`})
        } catch (error) {
            console.error('Error al insertar en el bucket:', error);
            res.status(500).json({ Error: `${error}`,pubObject:`${putObjectRequest}`});
            throw error;
        }finally{
            if (fs.existsSync(file.tempFilePath)) {
                fs.unlink(file.tempFilePath, (err) => {
                    if (err) {
                        console.error('Error al eliminar el archivo local:', err);
    
                    } else {
                        console.log('Archivo local eliminado con éxito.');
                    }
                });
            }
        }
    }
    async getByIdProfesional(profesionalId) {
        let connection;
        const servicios = [];

        try {
            let query = `
            SELECT s.id,profesional_id , s.titulo, s.foto, s.descripcion from servicios s
            where s.profesional_id = :id and estado = 1`;

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
    async inactivarServicio(servicio){
        let servicioID = servicio.idServicio;//obtiene el id del servicio capturado por json, la clave es idUsuario
        let connection;
        try {
            let query = `UPDATE servicios SET estado = 2 WHERE id= :idServicio`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, { idServicio: servicioID},{autoCommit:true});
            console.log(result)
        } catch (err) {
            console.error(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
    async editarServicio(servicio){
        let servicioID = servicio.idServicio;//obtiene el id del servicio capturado por json, la clave es idUsuario
        let titulo = servicio.titulo;
        let descripcion = servicio.descripcion;
        let connection;
        try {
            let query = `UPDATE servicios SET titulo = :titulo, descripcion= :descripcion WHERE id= :idServicio`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, {titulo:titulo,descripcion:descripcion,idServicio: servicioID,},{autoCommit:true});
            
        } catch (err) {
            console.error(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    }
}