'use strict';
const db = require('../controllers/database.controller');

let queryDatabase = (req, res, next) =>{
    db.query(res.locals.query, (err, results, fields) => {
        if (err) {
            let e = new Error(err);
            e.name = "internal";
            return next(e);
        }
        if (results.length == 0) {
            let e = new Error('No encontrado');
            e.name = "notFound";
            return next(e);
        }
        res.locals.response["results"] = results;
        res.status(res.locals.response.status).send(res.locals.response);
    });
}

exports.get = (req, res, next) => {
    res.locals.response = {
        status: 200,
        name: 'Ok',
        message: 'Ok'
    }
    queryDatabase(req, res, next);
}
exports.create = (req, res, next) => {
    res.locals.response = {
        status: 201,
        name: 'Created',
        customMessage: 'El objecto fue registrado con exito',
        message: 'Recurso creado',
    };
    queryDatabase(req, res, next);
}
exports.update = (req, res, next) => {
    res.locals.response = {
        status: 200,
        name: 'Updated',
        customMessage: 'El objecto fue editado con exito',
        message: 'Recurso editado',
    };
    queryDatabase(req, res, next);
}
exports.delete = (req, res, next) => {
    res.locals.response = {
        status: 200,
        name: 'Updated',
        customMessage: 'El objecto fue borrado con exito',
        message: 'Recurso borrado',
    };
    queryDatabase(req, res, next);

}