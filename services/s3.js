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
const fecha = new Date();
const fechaFormato = `${fecha.getFullYear()}${fecha.getMonth()+1}${fecha.getDate()}_${fecha.getHours()}${fecha.getMinutes()}`;;


 async function uploadFile(file){
    try {
        const extension = file.name.split('.').pop();
        const stream =fs.createReadStream(file.tempFilePath);
        const nombreSinExtension = file.name.substring(0, file.name.lastIndexOf('.'));
        const nombreArchivo = `${nombreSinExtension}_${fechaFormato}.${extension}`;
        const uploadParams={
            Bucket:configuracion.AWS_BUCKET_NAME,
            Key:nombreArchivo,
            Body:stream,
        }
        const command = new PutObjectCommand(uploadParams);
        const url = `https://${configuracion.AWS_BUCKET_NAME}.s3.${configuracion.AWS_BUCKET_REGION}.amazonaws.com/${nombreArchivo}`
        const result = await client.send(command);
        return url;
    } catch (error) {
        console.error('Error al insertar en el bucket:', error);
        throw error;
    }
    finally{
        if (fs.existsSync(file.tempFilePath)) {
            fs.unlink(file.tempFilePath, (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo local:', err);

                } else {
                    console.log('Archivo local eliminado con éxito.');
                }
            });
        }
    }
}
module.exports = {uploadFile}