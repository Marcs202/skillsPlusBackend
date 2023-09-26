/*const oracledb = require('oracledb');
db = {
  user: 'admin',
  password: 'EstaPassEsLarga123',
  connectString: 'skillsdb_high'
  
}
oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_11' });
let con;

async function open(sql,binds,autoCommit) {
  con = await oracledb.getConnection(db);
  let result = await con.execute(sql,binds,{autoCommit});
  con.release();
  return result;
}
async function close(sql,binds, autoCommit){
  con.close();
}
exports.Open = open;
exports.Close = close;
*/