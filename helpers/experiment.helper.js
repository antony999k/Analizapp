//helpers/experiment.helper.js
'use strict'


var queryAll = function(){
    return '\
        SELECT \
            e.id as id, \
            e.nombre as nombre, \
            e.descripcion as descripcion, \
            e.fecha as fecha, \
            u.correo as usuario \
        FROM \
            Experimento e \
        JOIN \
            Usuarios u \
        ON \
            e.usuario_id = u.id ';
}


exports.queryAll = queryAll;  

exports.queryBy = function(where_clause){
    return queryAll() + 'WHERE ' + where_clause;
}




exports.insertQuery = function(form){
    return '\
        INSERT INTO Experimento (\
            nombre, \
            descripcion, \
            usuario_id, \
            fecha \
        ) VALUES ( \
            "'+ form.nombre +'", \
            "'+ form.descripcion +'", \
            "'+ form.usuario_id +'", \
            "'+ form.fecha +'" \
        );';
}

exports.updateQuery = function(form){
    return '\
        UPDATE Experimento SET\
            nombre = "'+ form.nombre +'", \
            descripcion = "'+ form.descripcion +'", \
            fecha = "'+ form.fecha +'" \
        WHERE id = ' + form.id;
}

exports.deleteQuery = function(id){
    return "DELETE FROM Experimento WHERE id = " + id;   
}