const oracledb = require('oracledb');
const configuracion = require('../config/config')
module.exports = class ServiciosService{
    constructor(){}
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
        return new ServiciosService();
    }
    async postServicio(servicio){
        let titulo=servicio.titulo;
        let foto= servicio.foto;
        let descripcion=servicio.descripcion;
        let profesionalId=servicio.profesionalId;
        console.log(titulo);
        console.log(foto);
        console.log(descripcion);
        console.log(profesionalId);
        
    }
}