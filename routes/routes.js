const {Router} = require ('express');
const router = Router();
const DB = require('../config/config');

router.get('/',(req,res)=>{
    res.status(200).json({
        message: "este mensaje es del servidor"
    })
});

router.get('/profesionales', async(req,res)=>{
    const profesionales=[];
    sql = `SELECT ID, NOMBRE, FOTO_PERFIL
    FROM (
        SELECT 
            perfiles_profesionales.*, 
            ROWNUM AS ranking
        FROM 
            perfiles_profesionales
        ORDER BY 
            calificacion_promedio DESC
    )
    WHERE ranking <= 10
    `;
    let result = await DB.Open(sql,[],false);//en el corchete van las variables como storage procedures
    //console.log(result);
    
    result.rows.map(profesional=>{
        let schemaProfesional ={
            "ID":profesional[0],
            "NOMBRE":profesional[1],
            "FOTOGRAFIA":profesional[2]
        }
        profesionales.push(schemaProfesional);
    });

    console.log(profesionales);
    res.json({profesionales});
});
module.exports = router;
