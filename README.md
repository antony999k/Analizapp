# API Analizapp
Creado: @antony999k y @javicuriel

[![version](https://img.shields.io/badge/version-1.0.0-ff69b4.svg)]()
[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/wasabeef/awesome-android-ui)

Gestiona el registro de usuarios, perfiles de usuarios, reportes de usuarios y datos de las imágenes.

# Endpoints

Ruta Desarrollo: http://127.0.0.1:3500/

Ruta Producción: http://138.68.53.94/

## Analizar imagen (POST) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /analyze

#### Header (Cualquier usuario registrado)
    'authorization':'$token'

#### Body
    {
        "metal_id": "$metal_id"
        "experimento_id": "$experimento_id"
        "descripcion": "$descripcion"
        "tiempo_minutos": "$tiempo_minutos"
        "grados": "$grados"
        "image": "$image_file"
    }

## Obtener todos los metales (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /metal/all

#### Header (Cualquier usuario registrado)
    'authorization':'$token'

## Obtener un metal (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /metal/get/:id

#### Header (Cualquier usuario registrado)
    'authorization':'$token'

## Crear un metal (POST) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /metal/new

#### Header (Cualquier usuario registrado)
    'authorization':'$token'

#### Body
    {
      "nombre":"$nombre",
      "descripcion":"$descripcion"
    }

## Editar un metal (PUT) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /metal/update/:id

#### Header (Cualquier usuario registrado)
    'authorization':'$token'

#### Body
    {
      "nombre":"$nombre",
      "descripcion":"$descripcion"
    }

## Borrar un metal (DELETE) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /metal/delete/:id

#### Header (Cualquier usuario registrado)
    'authorization':'$token'


## Obtener todos los usuarios (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /users

#### Header (Permiso de administrador)
    'authorization':'$token'

## Obtener un usuario (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/:id

#### Header (Permiso de administrador)
    'authorization':'$token'

## Obtener usuario del token actual (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/me

#### Header
    'authorization':'$token'

## Registrar/Agregar un usuario (POST) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/

#### Body
    {
    "usuario":{
        "nombre":"$nombre",
        "apellido":"$apellido",
        "correo":"$correo",
        "contrasenia":"$contrasenia"
        }
    }

## Login/Autenticar usuario (POST) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /user/login

#### Body
    {
      "correo":"$correo",
      "contrasenia":"$contrasenia"
    }

#### Respuesta esperada
    {
      "status": 200,
      "name": "Ok",
      "customMessage": "Autenticación correcta",
      "message": "Ok",
      "token":"$token",
    }

## Sumar el recurso de imgSubidas (PUT) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /add-uploaded-image

#### Header (Cualquier usuario registrado)
    'authorization':'$token'


## Contraseña olvidada / Mandar correo (POST) ![#ea4848](https://placehold.it/15/ea4848/000000?text=+)
    /user/recovery

### Body
    {
    "correo" : "$correo"
    }

## Contraseña olvidada / Cambiar contraseña (POST) ![#ea4848](https://placehold.it/15/ea4848/000000?text=+)
    /user/change-password

### Body
    {
    "token" : "$mailToken",
    "contrasenia" : "$nuevaContraseña"
    }

## Revisar estado del api (GET) ![#c5f015](https://placehold.it/15/c5f015/000000?text=+)
    /health

#### Respuesta esperada
    {
    "status": 200,
    "name": "OK",
    "message": "i'm healthy",
    "customMessage": "API Analizapp en funcionamiento"
    }

# Errores

## Manejo de Errores
Para manejar errores personalizados hay que crear el error y lanzar un next.

Todos los errores deben pasar por helper/error.helper.js.

### Ejemplo
    let e = new Error('{mensaje customizado de tu error}');
    e.name = "{ErrorType}";
    return next(e);

### ErrorType
Código de error  | ErrorType (e.name)
------------- | -------------
301  | movedPermanently
303  | seeOther
304  | notModified
307  | temporaryRedirect
308  | permanentRedirect
400  | badRequest
401  | unautorized
403  | forbidden
404  | notFound
405  | methodNotAllowed
409  | conflict
415  | unsupportedMediaType
418  | imATeapot
500  | internal
501  | notImplemented
502  | badGateway
503  | serviceUnavailable
504  | gatewayTimeout
507  | insufficientStorage

## Respuesta de errores
Los errores son retornados en JSON. Cada error tiene un **status**, **name**, **message** y **customMessage**.
El campo **message** es personalizado y debe estar en ingles

### Ejemplo de un status 400
    {
      "status": 400,
      "name": 'badRequest',
      "message": 'Bad Request' + (err.message ? ': ' + err.message : ''),
      "customMessage": 'Solicitud Erronea'
    }

# Contribuir con el API

## Iniciar aplicación (Desarrollo)
- `npm install` Instalar paquetes de npm
- `npm start` Para iniciar con nodemon
- `npm test` Para iniciar con node
- `npm run dev` Para iniciar en modo desarrollo (muesta los logs)

## Pasos para correcto funcionamiento
1. Descargar el repositorio
2. Instalar paquetes de npm
3. Es necesario contar con el archivo *.env*, este no se puede descargar via Github ya que contiene claves privadas (pedir al administrador del repositorio)

## Guía de estilos
### Mensajes en los Commits de Git

- Utilizar oraciones en presente ("Botón añadido" no "Se añadio botón")
- Comenzar el commit con mayúsculas
- Cuando solo se cambia documentacion añadir `[ci skip]` en el título del commit
- Considerar comenzar el commit con un emoji
    - :rocket: `:rocket:` cuando se lanza una nueva versión
    - :sparkles: `:sparkles:` cuando se añade nuevo código
    - :art: `:art:` mejora en el formato/estructura del código
    - :racehorse: `:racehorse:` mejora en el performance del código
    - :book: `:book:` cuando se escribe documentación
    - :bug: `:bug:` cuando se corrige un bug
    - :fire: `:fire:` cuando se eliminó código o archivos

## Notas

# Changelog
No existen cambios de ruptura

# Ayuda
@antony999k, antony999k@hotmail.com

@javicuriel
