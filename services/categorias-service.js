const oracledb = require('oracledb');
const configuracion = require('../config/config')
module.exports = class CategoriasService{
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
        return new CategoriasService();
    }
    async getAll(){
        let connection;
         const categorias = [];

        try {
            let query= `SELECT * FROM CATEGORIAS`;
            
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[], {autoCommit:true});
            result.rows.map(categoria => {
                let schemaCategorias = {
                    "ID": categoria[0],
                    "NOMBRE": categoria[1],
                    "FOTO": categoria[2]
                }
            categorias.push(schemaCategorias);

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
        return categorias;
    }
}