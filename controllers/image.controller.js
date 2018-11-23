'use strict';
const fs = require('fs');
const request = require('request');
const db = require('./database.controller');

var validate_image_form = function(form){
    return !(isNaN(form.metal_id) || isNaN(form.experimento_id) || isNaN(form.tiempo_minutos) || isNaN(form.grados) || typeof form.descripcion != 'string')    
}

//Analiza imagen a traves de Flask ********************************************************************************
exports.analyzeImage = (req, res, next) => {
    req.pipe(request.post('http://localhost:5000/analyze',null, (err, httpResponse, body) => {
        var data = JSON.parse(body);    
        if(err) return res.sendStatus(500);
        if(data["error"] != null || !validate_image_form(data.form)) return res.status(500).send({
            "error" : "Invalid format!"
        });
        db.query(
            'INSERT INTO Imagen( \
                metal_id, \
                usuario_id, \
                experimento_id, \
                descripcion, \
                tiempo_minutos, \
                grados, \
                area_picos, \
                area_abajo, \
                ruta_original, \
                ruta_analisis) \
            VALUES ( \
                ' + data.form.metal_id + ', \
                ' + res.locals.tokenDecoded.id + ', \
                ' + data.form.experimento_id + ', \
                "' + data.form.descripcion + '", \
                ' + data.form.tiempo_minutos + ', \
                ' + data.form.grados + ', \
                ' + data.results.peakArea + ', \
                ' + data.results.bottomArea + ', \
                "' + req.app.get('UPLOAD_FOLDER') + data.results.filename + '", \
                "' + req.app.get('ANALYZED_FOLDER') + data.results.filename + '");\
            SELECT LAST_INSERT_ID();',
        function(err, results, fields) {
            if (err){
                // Delete image if database error
                fs.unlink(req.app.get('UPLOAD_FOLDER') + data.results.filename , (err) => {});
                fs.unlink(req.app.get('ANALYZED_FOLDER') + data.results.filename , (err) => {});
                return res.status(500).send({
                    "error": err.toString()
                });
            } 
            res.status(200).send({
                status: 200,
                name: 'OK',
                message: 'Imagen analizada correctamente',
                image_id: results[0]["insertId"]
            });
        });
    }));
}

