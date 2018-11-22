//helpers/error.helper.js
'use strict'

// 3xx Redirecciones =================================================
//El cliente tiene que tomar una acción adicional para completar la petición.
exports.movedPermanently = (err, req, res) => {
    res.status(301).send({
        status: 301,
        name: 'movedPermanently',
        customMessage: 'Moved Permanently' + (err.message ? ': ' + err.message : ': '),
        message: 'Esta y todas las peticiones futuras deberían ser dirigidas a la URL dada'
    });
}

exports.seeOther = (err, req, res) => {
    res.status(303).send({
        status: 303,
        name: 'seeOther',
        customMessage: 'See Other' + (err.message ? ': ' + err.message : ': '),
        message: 'La respuesta a la petición puede ser encontrada bajo otra URL'
    });
}

exports.notModified = (err, req, res) => {
    res.status(304).send({
        status: 304,
        name: 'notModified',
        customMessage: 'Not Modified' + (err.message ? ': ' + err.message : ''),
        message: 'La petición a la URL no ha sido modificada desde que fue requerida por última vez'
    });
}

exports.temporaryRedirect = (err, req, res) => {
    res.status(307).send({
        status: 307,
        name: 'temporaryRedirect',
        customMessage: 'Temporary Redirect' + (err.message ? ': ' + err.message : ''),
        message: 'Petición que debería haber sido hecha con otra URI, sin embargo aún puede ser procesada con la URL proporcionada'
    });
}

exports.permanentRedirect = (err, req, res) => {
    res.status(308).send({
        status: 308,
        name: 'permanentRedirect',
        customMessage: 'Permanent Redirect' + (err.message ? ': ' + err.message : ''),
        message: 'El recurso solicitado por el navegador se encuentra en otro lugar y este cambio es permanente'
    });
}

// 4xx Errores del cliente =================================================
//La solicitud contiene sintaxis incorrecta o no puede procesarse.
exports.badRequest = (err, req, res) => {
    res.status(400).send({
        status: 400,
        name: 'badRequest',
        customMessage: 'Bad Request' + (err.message ? ': ' + err.message : ''),
        message: 'Solicitud Erronea'
    });
}

exports.unautorized = (err, req, res) => {
    res.status(401).send({
        status: 401,
        name: 'unautorized',
        customMessage: 'Unautorized' + (err.message ? ': ' + err.message : ''),
        message: 'La autentificación es posible pero ha fallado o aún no ha sido provista'
    });
}

exports.forbidden = (err, req, res) => {
    res.status(403).send({
        status: 403,
        name: 'forbidden',
        customMessage: 'Forbidden' + (err.message ? ': ' + err.message : ''),
        message: 'No se tienen los permisos necesarios'
    });
}

exports.notFound = (err, req, res) => {
    res.status(404).send({
        status: 404,
        name: 'notFound',
        customMessage: 'Not Found' + (err.message ? ': ' + err.message : ''),
        message: 'Recurso no encontrado'
    });
}

exports.methodNotAllowed = (err, req, res) => {
    res.status(405).send({
        status: 405,
        name: 'methodNotAllowed',
        customMessage: 'Not Found' + (err.message ? ': ' + err.message : ''),
        message: 'La petición fue hecha a una URI utilizando un método de solicitud no soportado por dicha URL; por ejemplo, cuando se utiliza GET en un formulario que requiere que los datos sean presentados vía POST, o utilizando PUT en un recurso de solo lectura'
    });
}

exports.conflict = (err, req, res) => {
    res.status(409).send({
        status: 409,
        name: 'Conflict',
        customMessage: 'Conflict' + (err.message ? ': ' + err.message : ''),
        message: 'Conflicto con el estado actual del recurso'
    });
}

exports.unsupportedMediaType = (err, req, res) => {
    res.status(415).send({
        status: 415,
        name: 'unsupportedMediaType',
        customMessage: 'Unsupported Media Type' + (err.message ? ': ' + err.message : ''),
        message: 'La petición del navegador tiene un formato que no entiende el servidor y por eso no se procesa.'
    });
}

exports.imATeapot = (err, req, res) => {
    res.status(418).send({
        status: 418,
        name: 'imATeapot',
        customMessage: 'I am a teapot' + (err.message ? ': ' + err.message : ''),
        message: 'Soy una tetera'
    });
}


// 5xx Errores de servidor =================================================
//El servidor falló al completar una solicitud aparentemente válida.
exports.internal = (err, req, res) => {
    res.status(500).send({
        status: 500,
        name: 'internalServerError',
        customMessage: 'Internal Server Error' + (err.message ? ': ' + err.message : ''),
        message: 'Error Interno en el Servidor'
    });
}

exports.notImplemented = (err, req, res) => {
    res.status(501).send({
        status: 501,
        name: 'notImplemented',
        customMessage: 'Not Implemented' + (err.message ? ': ' + err.message : ''),
        message: 'El servidor no soporta alguna funcionalidad necesaria para responder a la solicitud del navegador (como por ejemplo el método utilizado para la petición).'
    });
}

exports.badGateway = (err, req, res) => {
    res.status(502).send({
        status: 502,
        name: 'badGateway',
        customMessage: 'Bad Gateway' + (err.message ? ': ' + err.message : ''),
        message: 'El servidor ha recibido una respuesta inválida de otro servidor'
    });
}

exports.serviceUnavailable = (err, req, res) => {
    res.status(503).send({
        status: 503,
        name: 'serviceUnavailable',
        customMessage: 'Service Unavailable' + (err.message ? ': ' + err.message : ''),
        message: 'El servidor no puede responder a la petición del navegador porque está congestionado o está realizando tareas de mantenimiento'
    });
}

exports.gatewayTimeout = (err, req, res) => {
    res.status(504).send({
        status: 504,
        name: 'serviceUnavailable',
        customMessage: 'Gateway Timeout' + (err.message ? ': ' + err.message : ''),
        message: 'El servidor está actuando de proxy o gateway y no ha recibido a tiempo una respuesta del otro servidor, por lo que no puede responder adecuadamente a la petición del navegador'
    });
}

exports.insufficientStorage = (err, req, res) => {
    res.status(507).send({
        status: 507,
        name: 'insufficientStorage',
        customMessage: 'Insufficient Storage' + (err.message ? ': ' + err.message : ''),
        message: 'El servidor no puede crear o modificar el recurso solicitado porque no hay suficiente espacio de almacenamiento libre'
    });
}
