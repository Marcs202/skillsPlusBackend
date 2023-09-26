const oracledb = require('oracledb');
module.exports = class ProfesionalesService {
    constructor() { }
    static async init() {
        console.log(`process.env.DB_USER:${process.env.DB_USER}`);//admin
        console.log(`process.env.DB_PASSWORD:${process.env.DB_PASSWORD}`);//EstaPassEsLarga123
        console.log(`process.env.CONNECT_STRING:${process.env.CONNECT_STRING}`);//skillsdb_high
        console.log(`process.env.DIRECCION:${process.env.ORACLE_LIB_DIR}`)
        console.log('Creando pool de conexiones...');
        //'C:\\oracle\\instantclient_21_11' ;
        const direccion = process.env.ORACLE_LIB_DIR;// process.env.DIRECCION;
        const user= process.env.DB_USER;
        const password = process.env.DB_PASSWORD;
        const connectString =process.env.CONNECT_STRING; 
        
        oracledb.initOracleClient({ libDir: direccion });

        await oracledb.createPool({
            user: user,
            password: password,
            connectString: connectString,
        });
        console.log('Pool de conexiones creado.')
        return new ProfesionalesService();
    }
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
}