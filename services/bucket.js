const common = require('oci-common');
const objectStorage = require('oci-objectstorage');
const fs = require('fs')
const objectCommon = new common.ConfigFileAuthenticationDetailsProvider();//esta reconoce el config como esta en la ubicacion por defecto no se ingresa
const objectStorageClient = new objectStorage.ObjectStorageClient({ authenticationDetailsProvider: objectCommon });//crea la conexion object cloud

async function uploadImage(file) {
    const bucketName = 'skillsImages';
    const objectName = file.name;
    //const filePath = req.file.path;
    const stream = fs.createReadStream(file.tempFilePath);
    const putObjectRequest = {
        namespaceName: 'axjm5wci2rqn',
        bucketName: bucketName,
        objectName: objectName,
        putObjectBody: stream,
        contentLength: fs.statSync(file.tempFilePath).size,
        contentType: file.mimetype
    };
    try {
        const urlImagen = `https://axjm5wci2rqn.objectstorage.mx-queretaro-1.oci.customer-oci.com/n/axjm5wci2rqn/b/skillsImages/o/${objectName}`;
        const resultado = await objectStorageClient.putObject(putObjectRequest);
        console.log(resultado);
        return urlImagen;
    } catch (error) {
        console.error('Error al insertar en el bucket:', error);
        throw error;
    }

}

module.exports = { uploadImage }; 