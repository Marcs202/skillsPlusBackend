const oracledb = require('oracledb');
db = {
  user: 'admin',
  password: 'EstaPassEsLarga123',
  connectString: 'skillsdb_high'
  
}
oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_11' });
/*async function openSodaConnection(sql,binds, autoCommit){
    console.log(`process.env.DB_USER:admin`);//admin
        console.log(`process.env.DB_PASSWORD:EstaPassEsLarga123`);//EstaPassEsLarga123
        console.log(`process.env.CONNECT_STRING:skilldb_high}`);//copiala de la nube
        console.log('Creando pool de conexiones...')
    
        await oracledb.createPool({
          user: "admin",
          password: "EstaPassEsLarga123",
          connectString: "skilldb_high",
      });
   let connection;
   let result;
        try {
          
        console.log('Pool de conexiones creado.')
            let connection = await oracledb.getConnection(config);
            // Aquí puedes usar la conexión para acceder a SODA
            // Ejemplo: const soda = connection.getSodaDatabase();
            
            // Cierra la conexión cuando hayas terminado
           result = await connection.execute(sql,binds,{autoCommit});
           connection.release();
           console.log('Connected to the database');
          } catch (error) {
            console.error('Error: ', error.message);
          } finally {
            // Libera los recursos de OracleDB
            await connection.close();
            await oracledb.cleanup();
          }
   
    return result;
}*/

async function open(sql,binds,autoCommit) {
  let con = await oracledb.getConnection(db);
  let result = await con.execute(sql,binds,{autoCommit});
  con.release();
  return result;
}

exports.Open = open;