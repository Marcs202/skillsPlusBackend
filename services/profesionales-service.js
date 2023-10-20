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
        return new ProfesionalesService();
    }
    //getAllTop devuelve los 10 profesionales (id, nombre y fotografia) con mayor valoracion 
    async getAllTop() {
        let connection;
        const profesionales = [];
        try {
            connection = await oracledb.getConnection()
            let sql = `SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional,u.apellido, u.foto as Fotografia_Profesional,  c.nombre as Categoria, a.nombre as Departamento, p.calificacion_prom
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            ORDER BY p.calificacion_prom DESC
            FETCH FIRST 10 ROWS ONLY
                        `;
            //let result = await connection.execute(sql,binds,{autoCommit});
            let autoCommit = true;
            let result = await connection.execute(sql, [], { autoCommit });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario":profesional[1],
                    "Nombre": profesional[2],
                    "Apellido":profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria":profesional[5],
                    "Departamento":profesional[6],
                    "Calificacion":profesional[7]
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

    async getById(profesionalId) {
        let connection, profesionalInfo;

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional,u.apellido, u.foto as Fotografia_Profesional,  c.nombre as Categoria, a.nombre as Departamento, p.calificacion_prom 
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id where p.id = :id`;

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, [profesionalId], { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario":profesional[1],
                    "Nombre": profesional[2],
                    "Apellido":profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria":profesional[5],
                    "Departamento":profesional[6],
                    "Calificacion":profesional[7]
                }
                profesionalInfo = schemaProfesional;

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
    async getByUbicacion(departamento) {
        let connection;
        const profesionales = [];

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional, u.foto as Fotografia_Profesional,  c.nombre as Categoria, a.nombre as Departamento, p.calificacion_prom
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            where a.nombre = :departamento
            `

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, { departamento: departamento }, { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID": profesional[0],
                    "NOMBRE": profesional[1],
                    "CORREO": profesional[2],
                    "FOTOGRAFIA": profesional[3],
                    "CALIFICACION PROMEDIO": profesional[4],
                    "CATEGORIA": profesional[5],
                    "FOTO_CATEGORIA": profesional[6],
                    "DEPARTAMENTO": profesionales[7]
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
    async getAll() {
        let connection;
        const profesionales = [];

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional,u.apellido, u.foto as Fotografia_Profesional,  c.nombre as Categoria, a.nombre as Departamento, p.calificacion_prom 
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            `

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, [], { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario":profesional[1],
                    "Nombre": profesional[2],
                    "Apellido":profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria":profesional[5],
                    "Departamento":profesional[6],
                    "Calificacion":profesional[7]
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

    async getByCategory(categoria){
        let connection;
        const profesionales = [];

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional, u.foto as Fotografia_Profesional,  c.nombre as Categoria, a.nombre as Departamento, p.calificacion_prom
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            where c.nombre = :categoria
            `

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, { categoria: categoria }, { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID": profesional[0],
                    "NOMBRE": profesional[1],
                    "CORREO": profesional[2],
                    "FOTOGRAFIA": profesional[3],
                    "CALIFICACION PROMEDIO": profesional[4],
                    "CATEGORIA": profesional[5],
                    "FOTO_CATEGORIA": profesional[6],
                    "DEPARTAMENTO": profesionales[7]
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