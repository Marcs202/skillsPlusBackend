const oracledb = require('oracledb');

db = {
    user: 'admin',
    password: 'EstaPassEsLarga123',
    connectString: 'skillsdb_high'
}

async function open(sql,binds, autoCommit){
    let con = await oracledb.getConnection(db);
    let result = await con.execute(sql,binds,{autoCommit});
    con.release;
    return result;
}

exports.Open = open;