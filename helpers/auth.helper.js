//helpers/auth.helper.js
'use strict'
const jwt = require('jsonwebtoken');
const codeGenerator = require('node-code-generator');

//Encriptar token para sesiones de un día
exports.createToken = function(user) {
  let token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn:'1d' });
  return token
}

//Encriptar token para sesiones de 30 dias
exports.createToken30 = function(user) {
  let token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn:'30d' });
  return token
}

//Desencriptar token para sesiones
var decodeToken = function(token) {
  let decoded = jwt.verify(token, process.env.SECRET_KEY)
  return decoded
}

exports.validateRequest = function(token, callback){
  try {
    let tokenDecoded = decodeToken(token);
    callback(null, tokenDecoded);
  } catch (err) {
    let e;
    if (err.message == "jwt expired") {
      e = new Error('El token ah expirado');
      e.name = "unautorized";
    } else {
      e = new Error('No se pudo verificar la información del usuario');
      e.name = "internal";
    }
    callback(e, null);
  }
}

//Crear token para correo
exports.createMailToken = function() {
  let generator = new codeGenerator();
  let pattern = '######';
  let howMany = 1;
  let options = {};
  return generator.generateCodes(pattern, howMany, options)[0];
}
