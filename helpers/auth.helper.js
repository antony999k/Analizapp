//helpers/auth.helper.js
'use strict'
const jwt = require('jsonwebtoken');

//Encriptar token para sesiones
exports.createToken = function(user) {
  let token = jwt.sign(user, process.env.SECRET_KEY);
  return token
}

//Desencriptar token para sesiones
exports.decodeToken = function(token) {
  let decoded = jwt.verify(token, process.env.SECRET_KEY)
  return decoded
}
