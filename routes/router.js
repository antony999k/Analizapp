//routes/router.js
'use strict'
const express = require('express');
const router = express.Router();
//Rutas de controladores
const globalController = require('../controllers/global.controller');
//Rutas de helpers
const errorHelper = require('../helpers/error.helper');

module.exports = (() => {

  // General =========================================================
  //Maneja /
  router.get('/', globalController.initPath);
  router.post('/', globalController.initPath);
  router.put('/', globalController.initPath);
  router.delete('/', globalController.initPath);

  // Healt =========================================================
  //Revisa que el api funcione
  router.get('/health', globalController.health);
  //Maneja Health incorrecto
  router.post('/health', globalController.wrongHealth);
  router.put('/health', globalController.wrongHealth);
  router.delete('/health', globalController.wrongHealth);

  // Not Found =========================================================
  //Maneja las rutas no definidas
  router.all('*', globalController.wrongPath);
  /**
   *@throws
   */
   //Manejo de errores
  router.use(function(err, req, res, next) {
    if (err.name == 'movedPermanently') {
      errorHelper.permanentRedirect(err, req, res)
    } else if (err.name == 'seeOther') {
      errorHelper.seeOther(err, req, res)
    } else if (err.name == 'notModified') {
      errorHelper.notModified(err, req, res)
    } else if (err.name == 'temporaryRedirect') {
      errorHelper.temporaryRedirect(err, req, res)
    } else if (err.name == 'permanentRedirect') {
      errorHelper.permanentRedirect(err, req, res)
    } else if (err.name == 'badRequest') {
      errorHelper.badRequest(err, req, res)
    } else if (err.name == 'unautorized') {
      errorHelper.unautorized(err, req, res)
    } else if (err.name == 'forbidden') {
      errorHelper.forbidden(err, req, res)
    } else if (err.name == 'notFound') {
      errorHelper.notFound(err, req, res)
    } else if (err.name == 'methodNotAllowed') {
      errorHelper.methodNotAllowed(err, req, res)
    } else if (err.name == 'conflict') {
      errorHelper.conflict(err, req, res)
    } else if (err.name == 'unsupportedMediaType') {
      errorHelper.unsupportedMediaType(err, req, res)
    } else if (err.name == 'imATeapot') {
      errorHelper.imATeapot(err, req, res)
    } else if (err.name == 'internal') {
      errorHelper.internal(err, req, res)
    } else if (err.name == 'notImplemented') {
      errorHelper.notImplemented(err, req, res)
    } else if (err.name == 'badGateway') {
      errorHelper.badGateway(err, req, res)
    } else if (err.name == 'serviceUnavailable') {
      errorHelper.serviceUnavailable(err, req, res)
    } else if (err.name == 'gatewayTimeout') {
      errorHelper.gatewayTimeout(err, req, res)
    } else {
      errorHelper.internal(err, req, res)
    }
  });

  return router
})()
