'use strict';
const experimentHelper = require('../helpers/experiment.helper');
const crudHelper = require('../helpers/crud.helper');


// TODO: VALIDATE DATE (fecha)
var validate_form = function(form){
    return (typeof form.nombre == 'string' && typeof form.descripcion == 'string' && typeof form.fecha == 'string')
}

exports.newExperiment = (req, res, next) => {
    if(!validate_form(req.body)){
        let e = new Error('Se debe ingresar nombre, descripcion y fecha');
        e.name = "badRequest";
        return next(e);
    }
    req.body.usuario_id = res.locals.tokenDecoded.id;
    res.locals.query = experimentHelper.insertQuery(req.body);
    crudHelper.create(req, res, next);
}

exports.getAllExperiments = (req, res, next) => {
    res.locals.query = experimentHelper.queryAll();
    crudHelper.get(req, res, next);
}

exports.getExperiment = (req, res, next) => {
    if(isNaN(req.params.id)){
        let e = new Error(req.params.id +' no es un numero valido');
        e.name = "badRequest";
        return next(e);
    }
    res.locals.query = experimentHelper.queryBy('e.id =' + req.params.id)
    crudHelper.get(req, res, next);
}

exports.updateExperiment = (req, res, next) => {
    if(!validate_form(req.body) || isNaN(req.params.id)){
        let e = new Error('Formato invalido!');
        e.name = "badRequest";
        return next(e);
    }
    req.body.id = req.params.id;
    res.locals.query = experimentHelper.updateQuery(req.body);
    crudHelper.update(req, res, next);
}

exports.deleteExperiment = (req, res, next) => {
    if(isNaN(req.params.id)){
        let e = new Error(req.params.id +' no es un numero valido');
        e.name = "badRequest";
        return next(e);
    }
    res.locals.query = experimentHelper.deleteQuery(req.params.id);
    crudHelper.delete(req, res, next);
}
