CREATE TABLE `Usuarios` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) NOT NULL DEFAULT '',
  `apellido` varchar(20) NOT NULL DEFAULT '',
  `correo` varchar(50) NOT NULL DEFAULT '',
  `contrasenia` varchar(100) NOT NULL DEFAULT '',
  `img` varchar(300) DEFAULT NULL,
  `diaRegistro` date NOT NULL,
  `privilegios` varchar(10) NOT NULL DEFAULT 'usuario',
  `verificacion` varchar(20) DEFAULT 'desactivada',
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
);

create table Experimento(
    id int not null AUTO_INCREMENT,
    nombre varchar(100) not null,
    descripcion varchar(200) default '',
    usuario_id smallint(5) unsigned not null,
    fecha timestamp default current_timestamp,
    primary key (id),
    foreign key (usuario_id) references Usuarios(id)
);


create table Metal(
    id int not null AUTO_INCREMENT,
    nombre varchar(100) not null,
    descripcion varchar(200) default '',
    primary key (id)
);

create table Imagen (
    id int not null AUTO_INCREMENT,
    metal_id int not null,
    usuario_id smallint(5) unsigned not null,
    experimento_id int not null,
    descripcion varchar(200) default '',
    tiempo_minutos float,
    grados float,
    area_picos float,
    area_abajo float,
    ruta_original varchar(200) not null,
    ruta_analisis varchar(200) not null,
    primary key (id),
    foreign key (metal_id) references Metal(id),
    foreign key (usuario_id) references Usuarios(id),
    foreign key (experimento_id) references Experimento(id)
);
