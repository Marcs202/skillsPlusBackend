const oracledb = require('oracledb');
const configuracion = require('../config/config')
module.exports = class ProfesionalesService {
    constructor() { }
    static async init() {
        console.log(`process.env.DB_USER:${process.env.DB_USER}`);//admin
        console.log(`process.env.DB_PASSWORD:${process.env.DB_PASSWORD}`);//EstaPassEsLarga123
        console.log(`process.env.CONNECT_STRING:${process.env.CONNECT_STRING}`);//skillsdb_high
        console.log(`process.env.DIRECCION:${process.env.ORACLE_LIB_DIR}`)
        console.log('Creando pool de conexiones...');
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
        return new ProfesionalesService();
    }
    //getAllTop devuelve los 10 profesionales (id, nombre y fotografia) con mayor valoracion 
    async getAllTop() {
        let connection;
        const profesionales = [];
        try {
            connection = await oracledb.getConnection()
            let sql = `SELECT ID, NOMBRE, FOTO_PERFIL FROM (SELECT perfiles_profesionales.*, ROWNUM AS ranking
                    FROM perfiles_profesionales ORDER BY calificacion_promedio DESC)WHERE ranking <= 10 `;
            //let result = await connection.execute(sql,binds,{autoCommit});
            let autoCommit = true;
            let result = await connection.execute(sql, [], { autoCommit });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID": profesional[0],
                    "NOMBRE": profesional[1],
                    "FOTOGRAFIA": profesional[2]
                }
                profesionales.push(schemaProfesional);

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
        return profesionales;
    }
    //obtiene toda la  informacion de un solo profesional

    async getById(profesionalId){
        let connection, profesionalInfo;

        try {
            let query= `
            SELECT
            profesionales.id, profesionales.nombre,profesionales.correo, profesionales.foto_perfil, profesionales.calificacion_promedio,
            categoria.nombre, categoria.foto FROM perfiles_profesionales profesionales
            INNER JOIN categorias categoria  ON profesionales.categoria_fk  = categoria.id where profesionales.id = :id`;
            
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[profesionalId], {autoCommit:true});
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID": profesional[0],
                    "NOMBRE": profesional[1],
                    "CORREO": profesional[2],
                    "FOTOGRAFIA":profesional[3],
                    "CALIFICACION PROMEDIO":  profesional[4],
                    "CATEGORIA":  profesional[5],
                    "FOTO_CATEGORIA":profesional[6]
                }
            profesionalInfo=schemaProfesional;

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
        return profesionalInfo;
    }
    //obtiene a todos los profesionales ingresados en la base de datos
    async getByUbicacion(departamento){
        let connection;
         const profesionales = [];

        try {
            let query= `
            SELECT
                profesionales.id, profesionales.nombre,profesionales.correo, profesionales.foto_perfil, profesionales.calificacion_promedio,
                categoria.nombre AS nombre_categoria , categoria.foto AS foto_categoria, usuarios.departamento 
            FROM perfiles_profesionales profesionales
            INNER JOIN categorias categoria ON profesionales.categoria_fk  = categoria.id
            INNER JOIN Usuarios usuarios -- Uniendo la tabla "Usuarios" mediante la llave foránea
            ON profesionales.usuarios_fk = usuarios.id WHERE usuarios.departamento = :departamento
            `
            
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,{departamento: departamento}, {autoCommit:true});
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID": profesional[0],
                    "NOMBRE": profesional[1],
                    "CORREO": profesional[2],
                    "FOTOGRAFIA":profesional[3],
                    "CALIFICACION PROMEDIO":  profesional[4],
                    "CATEGORIA":  profesional[5],
                    "FOTO_CATEGORIA":profesional[6],
                    "DEPARTAMENTO":profesionales[7]
                }
            profesionales.push(schemaProfesional);

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
        return profesionales;
    }
    async getAll(){
        let connection;
         const profesionales = [];

        try {
            let query= `
            SELECT
                profesionales.id, profesionales.nombre,profesionales.correo, profesionales.foto_perfil, profesionales.calificacion_promedio,
                categoria.nombre AS nombre_categoria , categoria.foto AS foto_categoria, usuarios.departamento 
            FROM perfiles_profesionales profesionales
            INNER JOIN categorias categoria ON profesionales.categoria_fk  = categoria.id
            INNER JOIN Usuarios usuarios -- Uniendo la tabla "Usuarios" mediante la llave foránea
            ON profesionales.usuarios_fk = usuarios.id
            `
            
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[], {autoCommit:true});
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID": profesional[0],
                    "NOMBRE": profesional[1],
                    "CORREO": profesional[2],
                    "FOTOGRAFIA":profesional[3],
                    "CALIFICACION PROMEDIO":  profesional[4],
                    "CATEGORIA":  profesional[5],
                    "FOTO_CATEGORIA":profesional[6],
                    "DEPARTAMENTO":profesionales[7]
                }
            profesionales.push(schemaProfesional);

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
        return profesionales;
    }
    
}