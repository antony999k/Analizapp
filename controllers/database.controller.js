'use strict';
const mysql2 = require('mysql2');
const SSH2Client = require('ssh2').Client;
const database = require('../db/database');


exports.query = (statement , callback) => {
    let ssh = new SSH2Client();
    ssh.on('ready', function() {
      ssh.forwardOut('127.0.0.1', 3501, '127.0.0.1', 3306, function(err, stream) {
        if (err) throw err;
        database.sqlConf.stream = stream;
        let db = mysql2.createConnection(database.sqlConf);
        db.query(statement,callback);
      });
    }).connect(database.sshConf);
}