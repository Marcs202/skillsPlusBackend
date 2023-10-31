const oracledb = require('oracledb');
const configuracion = require('../config/config');

module.exports = class ContratacionesServices{
    constructor() {}
    static async init() {
        console.log('Creando pool de conexiones para categorias...');
        const direccion =configuracion.direccion; 
        const user= configuracion.user; 
        const password = configuracion.password; 
        const connectString = configuracion.connectString;
        
        if (direccion==''){
            oracledb.initOracleClient();//en el server se deja la variable vacia
        }else{
            oracledb.initOracleClient({ libDir: direccion }); 
        }
        await oracledb.createPool({
            user: user,
            password: password,
            connectString: connectString,
        });
        console.log('Pool de conexiones creado.')
        return new ContratacionesServices();
    }
    async getByClienteEspera(idCliente){
        let connection;
         const contrataciones = [];

        try {
            let query= `
            SELECT c.id as contratacion_id, uc.nombre AS nombre_usuario,
            uc.apellido AS apellido_usuario,
            up.nombre AS nombre_profesional,
            up.apellido AS apellido_profesional,
            s.titulo AS servicio_contratado
            FROM contratacion c
            INNER JOIN usuarios uc ON c.cliente_id = uc.id
            INNER JOIN usuarios up ON up.id = (SELECT usuarios_id FROM profesionales WHERE id = c.profesionales_id)
            INNER JOIN servicios s ON c.servicio_id = s.id
            WHERE c.estado_contrato = 0 AND uc.id =:idCliente
            `;
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[idCliente], {autoCommit:true});
            result.rows.map(contratacion => {
                let schemaContrataciones = {
                    "ContratacionID": contratacion[0],
                    "Nombre_Cliente": contratacion[1],
                    "Apellido_Cliente": contratacion[2],
                    "Nombre_profesional":contratacion[3],
                    "Apellido_Profesional":contratacion[4],
                    "Servicio contratado":contratacion[5]
                }
            contrataciones.push(schemaContrataciones);

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
        return contrataciones;
    }
    async getByClienteAceptado(idCliente){
        let connection;
         const contrataciones = [];

        try {
            let query= `
            SELECT c.id as contratacion_id, uc.nombre AS nombre_usuario,
            uc.apellido AS apellido_usuario,
            up.nombre AS nombre_profesional,
            up.apellido AS apellido_profesional,
            c.profesionales_ID as idProfesional,
            s.titulo AS servicio_contratado
            FROM contratacion c
            INNER JOIN usuarios uc ON c.cliente_id = uc.id
            INNER JOIN usuarios up ON up.id = (SELECT usuarios_id FROM profesionales WHERE id = c.profesionales_id)
            INNER JOIN servicios s ON c.servicio_id = s.id
            WHERE c.estado_contrato = 1 AND uc.id =:idCliente
            `;
            //El profesional NOMBRE APELLIDO ha aceptado prestar su servicio de SERVICIO
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[idCliente], {autoCommit:true});
            result.rows.map(contratacion => {
                let schemaContrataciones = {
                    "ContratacionID": contratacion[0],
                    "Nombre_Cliente": contratacion[1],
                    "Apellido_Cliente": contratacion[2],
                    "Nombre_profesional":contratacion[3],
                    "Apellido_Profesional":contratacion[4],
                    "ID_ProfesionalContratado":contratacion[5],
                    "Servicio contratado":contratacion[6]
                }
            contrataciones.push(schemaContrataciones);

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
        return contrataciones;
    }
    async getByClienteRechazado(idCliente){
        let connection;
         const contrataciones = [];

        try {
            let query= `
            SELECT c.id as contratacion_id, uc.nombre AS nombre_usuario,
            uc.apellido AS apellido_usuario,
            up.nombre AS nombre_profesional,
            up.apellido AS apellido_profesional,
            s.titulo AS servicio_contratado
            FROM contratacion c
            INNER JOIN usuarios uc ON c.cliente_id = uc.id
            INNER JOIN usuarios up ON up.id = (SELECT usuarios_id FROM profesionales WHERE id = c.profesionales_id)
            INNER JOIN servicios s ON c.servicio_id = s.id
            WHERE c.estado_contrato = 2 AND uc.id =:idCliente
            `;
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[idCliente], {autoCommit:true});
            result.rows.map(contratacion => {
                let schemaContrataciones = {
                    "ContratacionID": contratacion[0],
                    "Nombre_Cliente": contratacion[1],
                    "Apellido_Cliente": contratacion[2],
                    "Nombre_profesional":contratacion[3],
                    "Apellido_Profesional":contratacion[4],
                    "Servicio contratado":contratacion[5]
                }
            contrataciones.push(schemaContrataciones);

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
        return contrataciones;
    }
    async getByProfesionalEspera(idProfesional){
        let connection;
         const contrataciones = [];
        try {
            let query= `
            SELECT
            c.id as contratacion_id,
            uc.nombre AS nombre_usuario,
            uc.apellido AS apellido_usuario,
            up.nombre AS nombre_profesional,
            up.apellido AS apellido_profesional,
            s.titulo AS servicio_contratado
            FROM contratacion c
            INNER JOIN usuarios uc ON c.cliente_id = uc.id
            INNER JOIN usuarios up ON up.id = (SELECT usuarios_id FROM profesionales WHERE id = c.profesionales_id)
            INNER JOIN servicios s ON c.servicio_id = s.id
            WHERE c.estado_contrato = 0 AND c.profesionales_id =:idProfesional
            `;
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[idProfesional], {autoCommit:true});
            result.rows.map(contratacion => {
                let schemaContrataciones = {
                    "ContratacionID": contratacion[0],
                    "Nombre_Cliente": contratacion[1],
                    "Apellido_Cliente": contratacion[2],
                    "Nombre_profesional":contratacion[3],
                    "Apellido_Profesional":contratacion[4],
                    "Servicio contratado":contratacion[5]
                }
            contrataciones.push(schemaContrataciones);

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
        return contrataciones;
    }
    async getByProfesionalAceptado(idProfesional){
        let connection;
         const contrataciones = [];
        try {
            let query= `
            SELECT
            c.id as contratacion_id,
            uc.nombre AS nombre_usuario,
            uc.apellido AS apellido_usuario,
            up.nombre AS nombre_profesional,
            up.apellido AS apellido_profesional,
            s.titulo AS servicio_contratado
            FROM contratacion c
            INNER JOIN usuarios uc ON c.cliente_id = uc.id
            INNER JOIN usuarios up ON up.id = (SELECT usuarios_id FROM profesionales WHERE id = c.profesionales_id)
            INNER JOIN servicios s ON c.servicio_id = s.id
            WHERE c.estado_contrato = 1 AND c.profesionales_id =:idProfesional
            `;
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[idProfesional], {autoCommit:true});
            result.rows.map(contratacion => {
                let schemaContrataciones = {
                    "ContratacionID": contratacion[0],
                    "Nombre_Cliente": contratacion[1],
                    "Apellido_Cliente": contratacion[2],
                    "Nombre_profesional":contratacion[3],
                    "Apellido_Profesional":contratacion[4],
                    "Servicio contratado":contratacion[5]
                }
            contrataciones.push(schemaContrataciones);

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
        return contrataciones;
    }
    async getByProfesionalRechazado(idProfesional){
        let connection;
         const contrataciones = [];
        try {
            let query= `
            SELECT
            c.id as contratacion_id,
            uc.nombre AS nombre_usuario,
            uc.apellido AS apellido_usuario,
            up.nombre AS nombre_profesional,
            up.apellido AS apellido_profesional,
            s.titulo AS servicio_contratado
            FROM contratacion c
            INNER JOIN usuarios uc ON c.cliente_id = uc.id
            INNER JOIN usuarios up ON up.id = (SELECT usuarios_id FROM profesionales WHERE id = c.profesionales_id)
            INNER JOIN servicios s ON c.servicio_id = s.id
            WHERE c.estado_contrato = 2 AND c.profesionales_id =:idProfesional
            `;
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[idProfesional], {autoCommit:true});
            result.rows.map(contratacion => {
                let schemaContrataciones = {
                    "ContratacionID": contratacion[0],
                    "Nombre_Cliente": contratacion[1],
                    "Apellido_Cliente": contratacion[2],
                    "Nombre_profesional":contratacion[3],
                    "Apellido_Profesional":contratacion[4],
                    "Servicio contratado":contratacion[5]
                }
            contrataciones.push(schemaContrataciones);

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
        return contrataciones;
    }
    async putAceptarCliente(contratacion){
        let contratacionId = contratacion.idContratacion;//obtiene el id del servicio capturado por json, la clave es idUsuario
        
        let connection;
        try {
            let query = `UPDATE contratacion SET estado_contrato = 1 WHERE id= :idContrato`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, [contratacionId],{autoCommit:true});
            
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
    async putRechazarCliente(contratacion){
        let contratacionId = contratacion.idContratacion;//obtiene el id del servicio capturado por json, la clave es idUsuario
        
        let connection;
        try {
            let query = `UPDATE contratacion SET estado_contrato = 2 WHERE id= :idContrato`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, [contratacionId],{autoCommit:true});
            
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
    async putFinalizarContrato(contratacion){
        let contratacionId = contratacion.idContratacion;//obtiene el id del servicio capturado por json, la clave es idUsuario
        
        let connection;
        try {
            let query = `UPDATE contratacion SET estado_contrato = 3 WHERE id= :idContrato`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, [contratacionId],{autoCommit:true});
            
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
    async editarUsuario(usuario){
        let id = usuario.idUsuario;//obtiene el id del servicio capturado por json, la clave es idUsuario
        let nombre = usuario.nombre;
        let apellido = usuario.apellido;
        let correo = usuario.correo;
        let pass = usuario.pass;

        let connection;
        try {
            let query = `UPDATE USUARIOS SET nombre = :nombre, apellido= :apellido, correo=:correo, contraseña=:pass WHERE id= :id`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, {nombre:nombre,apellido:apellido,correo: correo,pass:pass, id:id},{autoCommit:true});
            
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
    async crearContratacion(servicio){
        let connection;
        let jsonRecibido=servicio
        try {
            let profesional=jsonRecibido.profesionalId;
            let contratista=jsonRecibido.contratistaId;
            let servicio=jsonRecibido.servicioId;
            let query = `
            insert into CONTRATACION (CLIENTE_ID,SERVICIO_ID,PROFESIONALES_ID,ESTADO_CONTRATO)
            VALUES (:contratista,:servicio,:profesional,0)
            `;
            connection = await oracledb.getConnection();
            const result = await connection.execute(query, [contratista,servicio,profesional],{autoCommit:true});
            console.log(result);
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
        
        // if (usuarios) {
        //     return { mensaje: 'Inicio de sesión exitoso!', id: usuarios.ID };
        // } else {
        //     throw new Error('Correo o contraseña incorrectos');
        // }
    }
    async postCalificarContrato(contrato) {
        //profesional es el json que se recibe del metodo post 
        let contratoID = contrato.idContrato;//obtiene el id del contrato capturado por json, la clave es idUsuario
        let calificacion = contrato.calificacion;

        let connection;
        try {
            let query = `
            BEGIN actualizar_calificacion(:idContrato,:Calificacion);
            END;`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, { idContrato: contratoID, Calificacion: calificacion });

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