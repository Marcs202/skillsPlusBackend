const { Router } = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');
const CONTRATACIONES_SERVICE = 'contratacionesService';


//cuando se clickee el contratar será un post, el aceptar sera un put, 
//rechazar sera un put, cuando se acepte debera mostrarsele el correo y cambiar a estado aceptado
//cuando rechace solo cambia a estado rechazado
//el get del cliente tendrá todas las contrataciones que tenga él
//
//el get del profesional tendra todas las de tenga solo el profesional, 
//dentro podrá llamar al put de aceptar o rechazar, los que tengan estado de rechazado ya no le apareceran

///el usuario x quiere contratatar tu servicio y
///el profesional x aceptó tu contrato
//has enviado la oferta de contratar el servicio y al profesional z
//sera un post(crear la solicitud), dos put(aceptar, rechazar) y 6 get()
router.post('/', asyncHandler(async (req, res) => {
    res.status(201).send(await res.app.get(CONTRATACIONES_SERVICE).crearContratacion(req.body));//recibe JSON
  }));
//ingresa a traves de form o multipart (en la url)

/// get para la vista desde el lado del contratista
router.get('/clienteEspera', asyncHandler(async (req, res) => {
    const response = await res.app.get(CONTRATACIONES_SERVICE).getByClienteEspera(req.query.idCliente);
    if (response) {
        res.send(response);
    } else {
        res.sendStatus(404);
    }
}));
router.get('/clienteAceptado', asyncHandler(async (req, res) => {
    const response = await res.app.get(CONTRATACIONES_SERVICE).getByClienteAceptado(req.query.idCliente);
    if (response) {
        res.send(response);
    } else {
        res.sendStatus(404);
    }
}));
router.get('/clienteRechazado', asyncHandler(async (req, res) => {
    const response = await res.app.get(CONTRATACIONES_SERVICE).getByClienteRechazado(req.query.idCliente);
    if (response) {
        res.send(response);
    } else {
        res.sendStatus(404);
    }
}));
/// GET Para la vista desde el lado del profesional
router.get('/profesionalEspera', asyncHandler(async (req, res) => {
    const response = await res.app.get(CONTRATACIONES_SERVICE).getByProfesionalEspera(req.query.idProfesional);
    if (response) {
        res.send(response);
    } else {
        res.sendStatus(404);
    }
}));
router.get('/profesionalAceptado', asyncHandler(async (req, res) => {
    const response = await res.app.get(CONTRATACIONES_SERVICE).getByProfesionalAceptado(req.query.idProfesional);
    if (response) {
        res.send(response);
    } else {
        res.sendStatus(404);
    }
}));
router.get('/profesionalRechazado', asyncHandler(async (req, res) => {
    const response = await res.app.get(CONTRATACIONES_SERVICE).getByProfesionalRechazado(req.query.idProfesional);
    if (response) {
        res.send(response);
    } else {
        res.sendStatus(404);
    }
}));
router.put('/aceptar', asyncHandler(async (req, res) => {
    res.status(201).send(await res.app.get(CONTRATACIONES_SERVICE).putAceptarCliente(req.body));//envia un json
}));
router.put('/rechazar', asyncHandler(async (req, res) => {
    res.status(201).send(await res.app.get(CONTRATACIONES_SERVICE).putRechazarCliente(req.body));//envia un json
}));
router.put('/finalizar', asyncHandler(async (req, res) => {
    res.status(201).send(await res.app.get(CONTRATACIONES_SERVICE).putFinalizarContrato(req.body));//envia un json
}));
router.post('/calificar', asyncHandler(async (req, res) => {
    res.status(201).send(await res.app.get(CONTRATACIONES_SERVICE).postCalificarContrato(req.body));//recibe JSON
  }));
module.exports = router;
