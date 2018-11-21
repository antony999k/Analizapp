//helpers/auth.helper.js
'use strict'
const jwt = require('jsonwebtoken');

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
exports.decodeToken = function(token) {
  let decoded = jwt.verify(token, process.env.SECRET_KEY)
  return decoded
}
