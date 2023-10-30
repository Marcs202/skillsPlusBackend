const { S3Client,PutObjectCommand } = require("@aws-sdk/client-s3");
const configuracion = require('../config/config')
const fs = require('fs');
const client = new S3Client({
    region: configuracion.AWS_BUCKET_REGION,
    credentials:{
        accessKeyId: configuracion.AWS_PUBLIC_KEY,
        secretAccessKey: configuracion.AWS_SECRET_KEY
    }
});

 async function uploadFile(file){
    const stream =fs.createReadStream(file.tempFilePath);
    const uploadParams={
        Bucket:configuracion.AWS_BUCKET_NAME,
        Key:file.name,
        Body:stream,

    }
    const command = new PutObjectCommand(uploadParams);
    const result = await client.send(command);
    console.log(result);
}
module.exports = {uploadFile}