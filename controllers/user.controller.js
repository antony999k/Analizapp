//controllers/user.controller.js
'use strict';
const debug = require('debug')('dev');
const authHelper = require('../helpers/auth.helper');
const bcrypt = require('bcrypt');
const saltRounds = 13;
const db = require('./database.controller');

//Obtener todos los Usuarios ********************************************************************************
exports.getUsers = (req, res, next) => {
  db.query(
    'SELECT * FROM `Usuarios`',
    function(err, results, fields) {
      res.send(results)
  });
}

//Obtener un usuario ********************************************************************************
exports.getUser = (req, res, next) => {
  if (req.params.id == null || req.params.id == undefined) {
    let e = new Error('Se debe ingresar un id');
    e.name = "badRequest";
    return next(e);
  }

  let id = req.params.id;

  db.query(
    'SELECT id, nombre, apellido, correo, img, imgSubidas, empresa, puesto, area FROM Usuarios WHERE id=' + id,
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
      res.status(200).send(finalResults);
    }
  );
}

//Obtener mi usuario ********************************************************************************
exports.getMyUser = (req, res, next) => {
  db.query(
    'SELECT id, nombre, apellido, correo, img, imgSubidas, empresa, puesto, area FROM Usuarios WHERE correo=\'' + res.locals.tokenDecoded.correo + '\'',
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

      res.send(finalResults)
    }
  );

}

//Registrar un usuario ********************************************************************************
exports.registerUser = (req, res, next) => {
  if (req.body.usuario == null || req.body.usuario == undefined) {
    let e = new Error('Se debe ingresar un usuario');
    e.name = "badRequest";
    return next(e);
  } else if (req.body.usuario.nombre == null || req.body.usuario.nombre == undefined, req.body.usuario.apellido == null || req.body.usuario.apellido == undefined, req.body.usuario.correo == null || req.body.usuario.correo == undefined, req.body.usuario.contrasenia == null || req.body.usuario.contrasenia == undefined) {
    let e = new Error('Se debe ingresar los campos requeridos (nombre, apellido, correo, contrasenia)');
    e.name = "badRequest";
    return next(e);
  }

  let Usuario = req.body.usuario;

  bcrypt.hash(req.body.usuario.contrasenia, saltRounds, function(err, hash) {
    if (err) {
      let e = new Error('Error al guardar usuario');
      e.name = "internal";
      return next(e);
    }
    Usuario.contrasenia = hash;
    Usuario.diaRegistro = new Date().toISOString().slice(0, 10).replace('T', ' ');

    db.query(
      'INSERT INTO Usuarios (nombre, apellido, correo, contrasenia, diaRegistro) VALUES (\'' + Usuario.nombre + '\',\'' + Usuario.apellido + '\',\'' + Usuario.correo + '\',\'' + Usuario.contrasenia + '\',\'' + Usuario.diaRegistro + '\');SELECT LAST_INSERT_ID();',
      function(err, results, fields) {
        if (err) {
          if(err.toString().search('Duplicate entry')){
            let e = new Error("Ya existe un usuario con ese correo");
            e.name = "conflict";
            return next(e);
          }else{
            let e = new Error(err);
            e.name = "internal";
            return next(e);
          }
        }
        res.status(201).send({
          status: 201,
          name: 'Created',
          customMessage: 'El usuario fue registrado con exito',
          message: 'Recurso creado',
          token: authHelper.createToken({"correo": Usuario.correo, "id": results[0]["insertId"], "admin": false})
        });
      }
    );
  });
}

///LOGIN/ ingresar con un usuario ********************************************************************************
exports.loginUser = (req, res, next) => {
  if ((req.body.correo == null || req.body.correo == undefined) || (req.body.contrasenia == null || req.body.contrasenia == undefined)) {
    let e = new Error('Se debe ingresar correo y contraseña');
    e.name = "badRequest";
    return next(e);
  }

  let hash = "";

  db.query(
    'SELECT id, privilegios, contrasenia FROM Usuarios WHERE correo=\'' + req.body.correo + '\'',
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
      let admin = false;

      if(finalResults.privilegios == "admin"){
        admin = true;
      }


      bcrypt.compare(req.body.contrasenia, hash, function(err, resp) {
        if(resp == false){
          let e = new Error('Las credenciales no son válidas');
          e.name = "unautorized";
          return next(e);
        }else{
          res.status(200).send({
            status: 200,
            name: 'Ok',
            customMessage: 'Autenticación correcta',
            message: 'Ok',
            token: authHelper.createToken({"correo": req.body.correo, "id": finalResults.id, "admin": admin })
          })
        }
      });
    }
  );
}

//Recuperar cuenta ( Mandar correo ) ********************************************************************************
exports.recovery = (req, res, next) =>{
  if (req.body.correo == null || req.body.correo == undefined) {
    let e = new Error('Se debe ingresar un correo');
    e.name = "badRequest";
    return next(e);
  }

  let mailToken = "";

  //Crear un mailToken
  try {
    mailToken = authHelper.createMailToken();
  } catch (err) {
    let e = new Error('No se pudo verificar la información del usuario');
    e.name = "internal";
    return next(e);
  }
  res.send({"mailToken" : mailToken})
}

//Recuperar cuenta ( Cambiar contraseña ) ********************************************************************************
exports.changePassword = (req, res, next)=>{
  res.send("jeloww2")
}

//Añadir imágen subida usuario ********************************************************************************
exports.addUploadedImage = (req, res, next) => {
  db.query(
    'UPDATE Usuarios SET imgSubidas = imgSubidas + 1  WHERE correo=\'' + res.locals.tokenDecoded.correo + '\'',
    function(err, results, fields) {
      if (err) {
        let e = new Error(err);
        e.name = "internal";
        return next(e);
      }
      res.status(200).send({
        status: 200,
        name: 'OK',
        customMessage: 'El usuario sumó una imágen correctamente',
        message: 'Recurso actualizado',
      });
  });
}
