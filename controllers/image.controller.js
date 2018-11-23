'use strict';
const fs = require('fs');
const request = require('request');
const db = require('./database.controller');


exports.getImages = (req, res, next) => {
    db.query(
        'SELECT \
            m.nombre as metal, \
            e.nombre as experimento, \
            i.tiempo_minutos as tiempo, \
            i.grados as grados, \
            i.area_picos as area_picos, \
            i.area_abajo as area_abajo, \
            i.ruta_original as ruta_original, \
            i.ruta_analisis as ruta_analisis \
        FROM \
            Imagen i \
        LEFT JOIN \
            Metal m \
        ON \
            m.id = i.metal_id \
        LEFT JOIN \
            Experimento e \
        ON \
            e.id = i.experimento_id \
        WHERE \
            i.usuario_id = '+res.locals.tokenDecoded.id+';',
    function(err, results, fields) {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        res.send(results);
    });
}

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
                let e = new Error(err);
                e.name = "internal";
                // Delete image if database error
                fs.unlink(req.app.get('UPLOAD_FOLDER') + data.results.filename , (err) => {});
                fs.unlink(req.app.get('ANALYZED_FOLDER') + data.results.filename , (err) => {});
                return next(e);
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

