//routes/router.js
'use strict'
const express = require('express');
const router = express.Router();
//Rutas de controladores
const globalController = require('../controllers/global.controller');
const userController = require('../controllers/user.controller');
const imageController = require('../controllers/image.controller');
const metalController = require('../controllers/metal.controller');
const experimentController = require('../controllers/experiment.controller');
//Rutas de middlewares
const authMiddleware = require('../middlewares/auth.middleware');
//Rutas de helpers
const errorHelper = require('../helpers/error.helper');

module.exports = (() => {

  // Usuarios =========================================================
  //Obtener todos los usuarios
  router.get('/users', authMiddleware.isAuth, authMiddleware.isAuthAdmin, userController.getUsers);
  //Obtener un usuario
  router.get('/user', userController.getUser);
  router.get('/user/me',authMiddleware.isAuth ,userController.getMyUser);
  router.get('/user/:id', authMiddleware.isAuth, authMiddleware.isAuthAdmin, userController.getUser);
  //Registrar un usuario
  router.post('/user', userController.registerUser);
  //Login Usuario
  router.post('/user/login', userController.loginUser);
  //Recuperar cuenta ( Mandar correo )
  router.post('/user/recovery', userController.recovery);
  //Recuperar cuenta ( Cambiar contraseña )
  router.post('/user/change-password', userController.changePassword);
  //Añadir imágen subida usuario
  router.put('/add-uploaded-image', authMiddleware.isAuth, userController.addUploadedImage)

  // Analisis de Imagenes ============================================
  router.get('/images/all', authMiddleware.isAuth ,imageController.getAllImages);
  router.get('/images/get/:id', authMiddleware.isAuth,imageController.getImage);
  router.get('/images/me', authMiddleware.isAuth,imageController.getImages);
  router.post('/images/analyze', authMiddleware.isAuth ,imageController.analyzeImage);

  // Metales ==========================================================
  router.get('/metal/all', authMiddleware.isAuth ,metalController.getAllMetals);
  router.get('/metal/get/:id', authMiddleware.isAuth ,metalController.getMetal);
  router.post('/metal/new', authMiddleware.isAuth ,metalController.newMetal);
  router.put('/metal/update/:id', authMiddleware.isAuth ,metalController.updateMetal);
  router.delete('/metal/delete/:id', authMiddleware.isAuth ,metalController.deleteMetal);

  // Experimentos ==========================================================
  router.get('/experiment/all', authMiddleware.isAuth ,experimentController.getAllExperiments);
  router.get('/experiment/get/:id', authMiddleware.isAuth ,experimentController.getExperiment);
  router.post('/experiment/new', authMiddleware.isAuth ,experimentController.newExperiment);
  router.put('/experiment/update/:id', authMiddleware.isAuth ,experimentController.updateExperiment);
  router.delete('/experiment/delete/:id', authMiddleware.isAuth ,experimentController.deleteExperiment);




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
