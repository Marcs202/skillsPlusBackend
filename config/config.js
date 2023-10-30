require('dotenv').config(); 
const direccion = process.env.ORACLE_LIB_DIR;
const user= process.env.DB_USER;
const password =process.env.DB_PASSWORD;
const connectString = process.env.CONNECT_STRING;
const AWS_BUCKET_NAME= process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION= process.env.AWS_BUCKET_REGION;
const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
module.exports={
  direccion,user,password,connectString,AWS_BUCKET_NAME,AWS_BUCKET_REGION,AWS_PUBLIC_KEY,AWS_SECRET_KEY
};  