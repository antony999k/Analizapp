// middlewares/auth.middleware.js
'use strict';
const authHelper = require('../helpers/auth.helper');
const bcrypt = require('bcrypt');
const debug = require('debug')('dev');
const mysql2 = require('mysql2');
const SSH2Client = require('ssh2').Client;
const database = require('../db/database');

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
    if(err.message == "jwt expired"){
      let e = new Error('El token ah expirado');
      e.name = "unautorized";
      return next(e);
    }else{
      let e = new Error('No se pudo verificar la información del usuario');
      e.name = "internal";
      return next(e);
    }
  }

  let hash = "";

  let ssh = new SSH2Client();
  ssh.on('ready', function() {
    ssh.forwardOut('127.0.0.1', 3501, '127.0.0.1', 3306, function(err, stream) {
      if (err) throw err;
      database.sqlConf.stream = stream;
      let db = mysql2.createConnection(database.sqlConf);
      db.query(
        'SELECT contrasenia FROM Usuarios WHERE correo=\'' + tokenDecoded.correo + '\'',
        function(err, results, fields) {
          if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
          }
          if (results.length == 0) {
            let e = new Error('Usuario no encontrado');
            e.name = "notFound";
            return next(e);
          }
          //Convierte el array en objeto
          let finalResults = results[0]
          hash = finalResults.contrasenia;

          //Revisa que el token decodificado contenga un password
          if(tokenDecoded.contrasenia == undefined || tokenDecoded.contrasenia == null){
            let e = new Error('No se pudo verificar el token de usuario');
            e.name = "internal";
            return next(e);
          }

          bcrypt.compare(tokenDecoded.contrasenia, hash, function(err, res) {
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
      );
    });
  }).connect(database.sshConf);
}
