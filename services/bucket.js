const common = require('oci-common');
const objectStorage = require('oci-objectstorage');
const fs = require('fs')
const objectCommon = new common.ConfigFileAuthenticationDetailsProvider();//esta reconoce el config como esta en la ubicacion por defecto no se ingresa
const objectStorageClient = new objectStorage.ObjectStorageClient({ authenticationDetailsProvider: objectCommon });//crea la conexion object cloud

async function uploadImage(file,res) {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().replace(/[:.]/g, '');
    const objectName = `${formattedDate}_${file.name}`;
    const bucketName = 'skillsImages';
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
        //console.log(putObjectRequest);
        const urlImagen = `https://axjm5wci2rqn.objectstorage.mx-queretaro-1.oci.customer-oci.com/n/axjm5wci2rqn/b/skillsImages/o/${objectName}`;
        const resultado = await objectStorageClient.putObject(putObjectRequest);
        return urlImagen;
    } catch (error) {
        console.error('Error al insertar en el bucket:', error);
        res.status(500).json({ Error: `${error}`,pubObject:`${putObjectRequest}`,resultado: `${resultado}` });
        throw error;
    }finally{
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

module.exports = { uploadImage }; 