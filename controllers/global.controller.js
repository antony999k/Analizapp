//controllers/global.controller.js
'use strict';
//Verificar que la aplicación corra correctamente
exports.health = (req, res)=>{
  res.status(200).send({
    status: 200,
    name: 'OK',
    message: `i\'m healthy`,
    customMessage: 'API Analizapp en funcionamiento'
  })
}

//Maneja la ruta / ya que no hace nada
exports.initPath = (req, res, next)=>{
  let e = new Error(`Utiliza health para revisar el estatus del api`);
  e.name = "seeOther";
  return next(e);
}

//Maneja cuando se coloca una metodo en health incorrecto
exports.wrongHealth = (req, res, next)=>{
  let e = new Error(`Método incorrecto para health`);
  e.name = "methodNotAllowed";
  return next(e);
}

//Maneja metodos incorrectos dentro del API
exports.wrongMethod = (req, res, next)=>{
  let e = new Error(`Método incorrecto`);
  e.name = "methodNotAllowed";
  return next(e);
}

//Ruta no encontrada
exports.wrongPath = (req, res, next)=>{
  let e = new Error(`Ruta no encontrada`);
  e.name = "notFound";
  return next(e);
}
