'use strict';
const fs = require('fs');
const request = require('request');
const db = require('./database.controller');
const imageHelper = require('../helpers/image.helper');

exports.getImage = (req, res, next) => {
    let query = imageHelper.queryBy('i.id = '+req.params.id);
    db.query(query, (err, results, fields) => {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        if (results.length == 0) {
            let e = new Error('Imagen no encontrada');
            e.name = "notFound";
            return next(e);
          }
        res.send(results);
    });
}

exports.getImages = (req, res, next) => {
    let query = imageHelper.queryBy('i.usuario_id = '+res.locals.tokenDecoded.id);
    
    db.query(query, (err, results, fields) => {
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
        data.usuario_id = res.locals.tokenDecoded.id;
        data.upload_folder = req.app.get('UPLOAD_FOLDER');
        data.analyzed_folder = req.app.get('ANALYZED_FOLDER');
        
        let query = imageHelper.insertQuery(data);

        db.query(query, function(err, results, fields) {
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
