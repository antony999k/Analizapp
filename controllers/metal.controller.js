'use strict';
const db = require('./database.controller');

var validate_metal_form = function(form){
    return (typeof form.nombre == 'string' && typeof form.descripcion == 'string')
}

exports.newMetal = (req, res, next) => {
    if(!validate_metal_form(req.body)){
        let e = new Error('Se debe ingresar nombre y descripcion');
        e.name = "badRequest";
        return next(e);
    }
    let query = 'INSERT INTO Metal(nombre, descripcion) VALUES ("'+ req.body.nombre +'", "'+ req.body.descripcion+'");SELECT LAST_INSERT_ID();';
    db.query(query, (err, results, fields) => {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        res.status(201).send({
            status: 201,
            name: 'Created',
            customMessage: 'El metal fue registrado con exito',
            message: 'Recurso creado',
            id: results[0]["insertId"]
        });
    });
}

exports.getMetal = (req, res, next) => {
    let query = 'SELECT id, nombre, descripcion from Metal WHERE id =' + req.params.id;
    db.query(query, (err, results, fields) => {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        if (results.length == 0) {
          let e = new Error('Metal no encontrado');
          e.name = "notFound";
          return next(e);
        }
        res.status(200).send({
            status: 200,
            name: 'Ok',
            message: 'Ok',
            results: results
        });
    })
}

exports.getAllMetals = (req, res, next) => {
    let query = 'SELECT id, nombre, descripcion from Metal';
    db.query(query, (err, results, fields) => {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        res.status(200).send({
            status: 200,
            name: 'Ok',
            message: 'Ok',
            results: results
        });
    })
}

exports.updateMetal = (req, res, next) => {
    if(!validate_metal_form(req.body)){
        let e = new Error('Se debe ingresar nombre y descripcion');
        e.name = "badRequest";
        return next(e);
    }
    let query = 'UPDATE Metal SET nombre = "'+req.body.nombre+'" , descripcion = "'+req.body.descripcion+'"  WHERE id =' + req.params.id;
    db.query(query, (err, results, fields) => {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        res.status(200).send({
            status: 200,
            name: 'Ok',
            customMessage: 'El metal fue editado correctamente',
            message: 'Ok'
        });

    })
}

exports.deleteMetal = (req, res, next) => {
    let query = 'DELETE FROM Metal WHERE id =' + req.params.id;
    db.query(query, (err, results, fields) => {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        res.status(200).send({
            status: 200,
            name: 'Ok',
            customMessage: 'El metal fue borrado exitosamente',
            message: 'Ok'
        });
    })
}

// create table Metal(
//     id int not null AUTO_INCREMENT,
//     nombre varchar(100) not null,
//     descripcion varchar(200) default '',
//     primary key (id)
// );
