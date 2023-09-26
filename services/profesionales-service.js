const oracledb = require('oracledb');
module.exports = class ProfesionalesService{
    constructor(){}
    static async init() {
        console.log(`process.env.DB_USER:admin`);//admin
        console.log(`process.env.DB_PASSWORD:EstaPassEsLarga123`);//EstaPassEsLarga123
        console.log(`process.env.CONNECT_STRING:skillsdb_high`);//copiala de la nube
        console.log('Creando pool de conexiones...');


        oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_11' });

        await oracledb.createPool({
            user: "admin",
            password: "EstaPassEsLarga123",
            connectString: "skillsdb_high",
        });
        
        console.log('Pool de conexiones creado.')
        return new ProfesionalesService();
    }
    async getAllTop(){
        let connection;
        const profesionales=[];
        try {
            connection = await oracledb.getConnection()
            let sql = `SELECT ID, NOMBRE, FOTO_PERFIL FROM (SELECT perfiles_profesionales.*, ROWNUM AS ranking
                    FROM perfiles_profesionales ORDER BY calificacion_promedio DESC)WHERE ranking <= 10 `;
            //let result = await connection.execute(sql,binds,{autoCommit});
            let autoCommit=false;
            let result = await connection.execute(sql,[],{autoCommit});
        result.rows.map(profesional=>{
            let schemaProfesional ={
                "ID":profesional[0],
                "NOMBRE":profesional[1],
                "FOTOGRAFIA":profesional[2]
            }
            profesionales.push(schemaProfesional);
            
        });
//        console.log(profesionales)
        
        } catch (error) {
            console.error(error);
        }
        finally{
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