const oracledb = require('oracledb');
const configuracion = require('../config/config');
const {uploadFile}=require('../services/s3')
module.exports = class UsuariosServices{
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
        return new UsuariosServices();
    }
    async getAll(){
        let connection;
         const usuarios = [];

        try {
            let query= `SELECT * FROM USUARIOS`;
            
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[], {autoCommit:true});
            result.rows.map(usuario => {
                let schemaUsuarios = {
                    "ID": usuario[0],
                    "Nombre": usuario[1],
                    "Apellido": usuario[2],
                    "Correo":usuario[3],
                    "Contraseña":usuario[4],
                    "Foto":usuario[5],
                    "Estado":usuario[6],
                    "Tipo":usuario[7]
                }
            usuarios.push(schemaUsuarios);

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
        return usuarios;
    }
    async getById(usuarioId){
        let connection;
        let usuarios;

        try {
            let query= `SELECT * FROM USUARIOS where id =:id`;
            
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[usuarioId], {autoCommit:true});
            result.rows.map(usuario => {
                let schemaUsuarios = {
                    "ID": usuario[0],
                    "Nombre": usuario[1],
                    "Apellido": usuario[2],
                    "Correo":usuario[3],
                    "Contraseña":usuario[4],
                    "Foto":usuario[5],
                    "Estado":usuario[6]
                }
            usuarios= schemaUsuarios

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
        return usuarios;
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
    async iniciarSesion(usuario){
        let correo=usuario.correo;
        let pass= usuario.pass;
        let connection;
        let usuarios;
        console.log(correo);
        console.log(pass);
        try {
            let query= `SELECT usuarios.id AS id_usuario, profesionales.id AS id_profesional
            FROM usuarios
            LEFT JOIN profesionales ON usuarios.id = profesionales.usuarios_id
            WHERE usuarios.correo = :correo AND usuarios.contraseña = :pass`;
            
            connection = await oracledb.getConnection();
            let result = await connection.execute(query,[correo,pass], {autoCommit:true});
            result.rows.map(usuario => {
                let schemaUsuarios = {
                    "ID_Usuario": usuario[0],
                    "ID_Profesional":usuario[1]
                }
            usuarios= schemaUsuarios
    
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
        
        if (usuarios) {
            return { mensaje: 'Inicio de sesión exitoso!', idUsuario: usuarios.ID_Usuario,idProfesional:usuarios.ID_Profesional };
        } else {
            throw new Error('Correo o contraseña incorrectos');
        }
    }
    async crearUsuario(req,res,file){
        let connection;
        try {
            let nombre = req.body.nombre;
            let apellido = req.body.apellido;
            let correo = req.body.correo;
            let pass = req.body.pass;
            const urlImagen = await  uploadFile(file)
            let query = `
                        INSERT INTO usuarios
                        (nombre,apellido,correo,contraseña,foto) 
                        VALUES (:nombre,:apellido,:correo,:pass,:url)
                `;
            connection = await oracledb.getConnection();
            const result = await connection.execute(query, [nombre, apellido, correo, pass,urlImagen], { autoCommit: true });
            res.status(200).json({url:`${urlImagen}`})
        } catch (error) {
            console.error('Error al insertar en el bucket:', error);
            res.status(500).json({ Error: `${error}`});
            throw error;
        }finally{
            try {
                await connection.close();
            }
            catch (error) {
                console.error(error);
            }
        }
    }
}