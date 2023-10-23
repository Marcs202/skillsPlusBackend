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
    //obtiene todos los profesionales
    async getAll() {
        let connection;
        const profesionales = [];

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional, u.apellido,u.foto as Fotografia_Profesional,  c.nombre as Categoria, MIN(a.nombre) as Departamento, p.calificacion_prom
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            where u.estado=1
            GROUP BY p.id, u.id, u.nombre,u.apellido, u.foto, c.nombre, p.calificacion_prom
            `
            connection = await oracledb.getConnection();
            let result = await connection.execute(query, [], { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario": profesional[1],
                    "Nombre": profesional[2],
                    "Apellido": profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria": profesional[5],
                    "Departamento": profesional[6],
                    "Calificacion": profesional[7]
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
    //getAllTop devuelve los 10 profesionales (id, nombre y fotografia) con mayor valoracion 
    async getAllTop() {
        let connection;
        const profesionales = [];
        try {
            connection = await oracledb.getConnection()
            let sql = `SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional, u.foto as Fotografia_Profesional,  c.nombre as Categoria, MIN(a.nombre) as Departamento, p.calificacion_prom
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            WHERE p.calificacion_prom IS NOT NULL AND u.estado=1
            GROUP BY p.id, u.id, u.nombre, u.foto, c.nombre, p.calificacion_prom
            ORDER BY p.calificacion_prom DESC
            FETCH FIRST 10 ROWS ONLY`;
            //let result = await connection.execute(sql,binds,{autoCommit});
            let autoCommit = true;
            let result = await connection.execute(sql, [], { autoCommit });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario": profesional[1],
                    "Nombre": profesional[2],
                    "Apellido": profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria": profesional[5],
                    "Departamento": profesional[6],
                    "Calificacion": profesional[7]
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
        let connection;
        const profesionales = [];

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional,u.apellido, u.foto as Fotografia_Profesional,  c.nombre as Categoria, a.nombre as Departamento, p.calificacion_prom 
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id where p.id = :id AND u.estado=1`;

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, [profesionalId], { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario": profesional[1],
                    "Nombre": profesional[2],
                    "Apellido": profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria": profesional[5],
                    "Departamento": profesional[6],
                    "Calificacion": profesional[7]
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
    //obtiene a todos los profesionales ingresados en la base de datos
    async getByUbicacion(departamento) {
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
            where a.nombre = :departamento AND u.estado=1
            `

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, { departamento: departamento }, { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario": profesional[1],
                    "Nombre": profesional[2],
                    "Apellido": profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria": profesional[5],
                    "Departamento": profesional[6],
                    "Calificacion": profesional[7]
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
    //Obtiene a todos los profesionales de una categoria
    async getByCategory(categoria) {
        let connection;
        const profesionales = [];

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario  ,u.nombre as Nombre_Profesional,u.apellido, u.foto as Fotografia_Profesional,  c.nombre as Categoria,MIN(a.nombre) as Departamento, p.calificacion_prom 
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            where c.nombre = :categoria AND u.estado=1
            GROUP BY p.id, u.id, u.nombre, u.apellido, u.foto, c.nombre, p.calificacion_prom
            `

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, { categoria: categoria }, { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario": profesional[1],
                    "Nombre": profesional[2],
                    "Apellido": profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria": profesional[5],
                    "Departamento": profesional[6],
                    "Calificacion": profesional[7]
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
    async getByCategoryDepartament(categoria,departamento){
        let connection;
        const profesionales = [];

        try {
            let query = `
            SELECT p.id, u.id as Id_usuario, u.nombre as Nombre_Profesional, u.apellido,u.foto as Fotografia_Profesional, c.nombre as Categoria, a.nombre as Departamento, p.calificacion_prom
            FROM usuarios u
            INNER JOIN profesionales p ON u.id = p.usuarios_id
            INNER JOIN categorias c ON p.categoria_id = c.id
            INNER JOIN departamento_usuario d ON d.usuario_id = u.id
            INNER JOIN departamento a ON d.departamento_id= a.id
            WHERE a.nombre= :departamento AND c.nombre= :categoria AND u.estado=1`

            connection = await oracledb.getConnection();
            let result = await connection.execute(query, { categoria: categoria,departamento:departamento }, { autoCommit: true });
            result.rows.map(profesional => {
                let schemaProfesional = {
                    "ID_Profesional": profesional[0],
                    "ID_Usuario": profesional[1],
                    "Nombre": profesional[2],
                    "Apellido": profesional[3],
                    "Fotografia": profesional[4],
                    "Categoria": profesional[5],
                    "Departamento": profesional[6],
                    "Calificacion": profesional[7]
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
    async postProfesional(profesional) {
        //profesional es el json que se recibe del metodo post 
        let usuarioID = profesional.idUsuario;//obtiene el id del usuario capturado por json, la clave es idUsuario
        let categoriaID = profesional.idCategoria;
        let departamentos = profesional.idsDepartamento;
        console.log(usuarioID);
        console.log(categoriaID);
        console.log(departamentos);
        let departametosIDS = departamentos.join(',');
        let connection;
        try {
            let query = `BEGIN ingresar_profesional_procedure(:p_user_id, :p_category_id,SYS.ODCINUMBERLIST(${departametosIDS})); END;`;
            // Obtén la conexión a la base de datos
            connection = await oracledb.getConnection();
            // Ejecuta el procedimiento almacenado
            const result = await connection.execute(query, { p_user_id: usuarioID, p_category_id: categoriaID });

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
    async postReportProfesional(profesional) {
        let connection;
        try {
            let profionalId = profesional.idProfesional;
            let query = `BEGIN incrementar_reporte(:id); END;`;
            connection = await oracledb.getConnection();
            const result = await connection.execute(query, [profionalId]);
            console.log("Se ejecuto result", result);
            
        } catch (error) {
            console.error('Error al subir el objeto:', error);
            
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