// middlewares/auth.middleware.js
'use strict';
const authHelper = require('../helpers/auth.helper');
const bcrypt = require('bcrypt');

exports.isAuth = (req, res, next)=>{
  //Revisa si authorization esta en la cabezera
  if(!req.headers.authorization){
    let e = new Error('No tienes permiso para acceder a este contenido');
    e.name = "forbidden";
    return next(e);
  }

  req.global = {};
  let token = req.headers.authorization;
  let tokenDecoded;

  //Decodifica el token
  try{
    tokenDecoded = authHelper.decodeToken(token);
  }catch(err){
    let e = new Error('No se pudo verificar la información del usuario');
    e.name = "internal";
    return next(e);
  }

  //Obtener hash de la base de datos
  let hash = 'alksnaisubdnaksjnms21iu819ujd'

  //Revisa que el token decodificado contenga un password
  if(tokenDecoded.password == undefined || tokenDecoded.password == null){
    let e = new Error('No se pudo verificar el token de usuario');
    e.name = "internal";
    return next(e);
  }

  bcrypt.compare(tokenDecoded.password, hash, function(err, res) {
    console.log(res);
    if(res == false){
      let e = new Error('Las credenciales no son válidas');
      e.name = "internal";
      return next(e);
    }else{
      return next();
    }
  });
}
