//app.js
'use strict'
// Variables / Imports ==================================================
//Imports
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const debug = require('debug')('dev');
const child_process = require("child_process")
require('dotenv').config({path: __dirname + '/.env'})
//Archivos
const router = require('./routes/router');

// Configuración ===================================================
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(compression()); //Hace el api más ligera y más rápida
app.use(helmet()); // Añade seguridad a las cabezaras http

// Corre servidor de flask para analisar imagenes
child_process.spawn("python", ["./analyze_server.py"], {stdio : "inherit"})

// DB  =========================================================

// Rutas =========================================================
app.use('/', router);

// Listen ========================================================
const port = process.env.PORT || 3500
app.listen(port, () => {
    debug('Analizapp: http://127.0.0.1:' + port);
});
