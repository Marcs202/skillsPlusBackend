const direccion =process.env.ORACLE_LIB_DIR;
const user= process.env.DB_USER;
const password =process.env.DB_PASSWORD;
const connectString =process.env.CONNECT_STRING ;

module.exports={
  direccion,user,password,connectString
};  