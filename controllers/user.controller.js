//controllers/user.controller.js
'use strict';
const debug = require('debug')('dev');
const database = require('../db/database');
const mysql2 = require('mysql2');
const SSH2Client = require('ssh2').Client;

//Obtener todos los Usuarios
exports.getUsers = (req, res, next) => {
  let ssh = new SSH2Client();
  ssh.on('ready', function() {
    ssh.forwardOut('127.0.0.1', 3501, '127.0.0.1', 3306, function(err, stream) {
        if (err) throw err;
        database.sqlConf.stream = stream;
        let db = mysql2.createConnection(database.sqlConf);
        db.query(
          'SELECT * FROM `Autos`',
          function(err, results, fields) {
            res.send(results)
          }
        );
      }
    );
  }).connect(database.sshConf);
}
