//helpers/images.helper.js
'use strict'

exports.queryBy = function(where_clause){
    return 'SELECT \
                i.id as id, \
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
                '+where_clause+';';
}

exports.insertQuery = function(data){
    return 'INSERT INTO Imagen( \
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
                ' + data.usuario_id + ', \
                ' + data.form.experimento_id + ', \
                "' + data.form.descripcion + '", \
                ' + data.form.tiempo_minutos + ', \
                ' + data.form.grados + ', \
                ' + data.results.peakArea + ', \
                ' + data.results.bottomArea + ', \
                "' + data.upload_folder + data.results.filename + '", \
                "' + data.analyzed_folder + data.results.filename + '");\
            SELECT LAST_INSERT_ID();';
}