'use strict';
const crudHelper = require('../helpers/crud.helper');

var validate_form = function(form){
    return (typeof form.nombre == 'string' && typeof form.descripcion == 'string')
}

exports.newMetal = (req, res, next) => {
    if(!validate_form(req.body)){
        let e = new Error('Se debe ingresar nombre y descripcion');
        e.name = "badRequest";
        return next(e);
    }
    res.locals.query = 'INSERT INTO Metal(nombre, descripcion) VALUES ("'+ req.body.nombre +'", "'+ req.body.descripcion+'");';
    crudHelper.create(req, res, next);
}

exports.getMetal = (req, res, next) => {
    if(isNaN(req.params.id)){
        let e = new Error(req.params.id +' no es un numero valido');
        e.name = "badRequest";
        return next(e);
    }
    res.locals.query = 'SELECT id, nombre, descripcion from Metal WHERE id =' + req.params.id;
    crudHelper.get(req, res, next);
}

exports.getAllMetals = (req, res, next) => {
    res.locals.query = 'SELECT id, nombre, descripcion from Metal';
    crudHelper.get(req, res, next);
}

exports.updateMetal = (req, res, next) => {
    if(!validate_form(req.body) || isNaN(req.params.id)){
        let e = new Error('Formato invalido!');
        e.name = "badRequest";
        return next(e);
    }
    res.locals.query = 'UPDATE Metal SET nombre = "'+req.body.nombre+'" , descripcion = "'+req.body.descripcion+'"  WHERE id =' + req.params.id;
    crudHelper.update(req, res, next);
}

exports.deleteMetal = (req, res, next) => {
    if(isNaN(req.params.id)){
        let e = new Error(req.params.id +' no es un numero valido');
        e.name = "badRequest";
        return next(e);
    }
    res.locals.query = 'DELETE FROM Metal WHERE id =' + req.params.id;
    crudHelper.delete(req, res, next);
}

