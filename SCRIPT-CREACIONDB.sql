CREATE DATABASE openlodgedb CHARACTER SET utf8mb4;
USE openlodgedb;

DROP TABLE IF EXISTS pais;
CREATE TABLE pais (
  id bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS ciudad;
CREATE TABLE ciudad (
  id bigint NOT NULL AUTO_INCREMENT,
  id_pais bigint NOT NULL,
  nombre varchar(100) NOT NULL,
  PRIMARY KEY (id),
  KEY FK_ciudad_pais (id_pais),
  CONSTRAINT FK_ciudad_pais FOREIGN KEY (id_pais) REFERENCES pais (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

DROP TABLE IF EXISTS direccion;
CREATE TABLE direccion (
  id bigint NOT NULL AUTO_INCREMENT,
  calle varchar(100) DEFAULT NULL,
  numero int DEFAULT NULL,
  depto varchar(50) DEFAULT NULL,
  piso int DEFAULT NULL,
  id_ciudad bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FK_direccion_ciudad (id_ciudad),
  CONSTRAINT FK_direccion_ciudad FOREIGN KEY (id_ciudad) REFERENCES ciudad (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS usuario;
CREATE TABLE usuario (
  id bigint NOT NULL AUTO_INCREMENT,
  username varchar(100) NOT NULL,
  password varchar(350) NOT NULL,
  email varchar(100) NOT NULL,
  nombre varchar(100) NOT NULL,
  apellido varchar(100) NOT NULL,
  telefono varchar(255) DEFAULT NULL,
  dni int NOT NULL,
  fecha_nacimiento date NOT NULL,
  fecha_creacion date NOT NULL,
  rol enum('ANFITRION', 'HUESPED', 'ADMINISTRADOR'),
  PRIMARY KEY (id),
  UNIQUE KEY UK_usuario_email (email),
  UNIQUE KEY UK_usuario_username (username),
  UNIQUE KEY UK_usuario_dni (dni)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS alojamiento;
CREATE TABLE alojamiento (
  id bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  descripcion varchar(100) NOT NULL,
  imagen varchar(300) NOT NULL,
  precio_noche double NOT NULL,
  capacidad_huespedes int DEFAULT NULL,
  fecha_creacion date NOT NULL,
  fecha_modificacion date NOT NULL,
  id_anfitrion bigint NOT NULL,
  id_direccion bigint NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_alojamiento_direccion (id_direccion),
  KEY FK_alojamiento_anfitrion (id_anfitrion),
  CONSTRAINT FK_alojamiento_anfitrion FOREIGN KEY (id_anfitrion) REFERENCES usuario (id),
  CONSTRAINT FK_alojamiento_direccion FOREIGN KEY (id_direccion) REFERENCES direccion (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS servicio;
CREATE TABLE servicio (
  id bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_servicio_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

DROP TABLE IF EXISTS servicio_alojamiento;
CREATE TABLE servicio_alojamiento (
  id_alojamiento bigint NOT NULL,
  id_servicio bigint NOT NULL,
  PRIMARY KEY (id_alojamiento,id_servicio),
  KEY FK_servicio_alojamiento_servicio (id_servicio),
  CONSTRAINT FK_servicio_alojamiento_alojamiento FOREIGN KEY (id_alojamiento) 
    REFERENCES alojamiento (id) ON DELETE CASCADE,
  CONSTRAINT FK_servicio_alojamiento_servicio FOREIGN KEY (id_servicio) 
    REFERENCES servicio (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS reserva;
CREATE TABLE reserva (
  id_usuario bigint NOT NULL,
  id_alojamiento bigint NOT NULL,
  fecha_checkin date NOT NULL,
  fecha_checkout date NOT NULL,
  huespedes int NOT NULL,
  importe double DEFAULT NULL,
  fecha_creacion date NOT NULL,
  fecha_modificacion date NOT NULL,
  PRIMARY KEY (id_usuario, id_alojamiento),
  KEY FK_reserva_alojamiento (id_alojamiento),
  CONSTRAINT FK_reserva_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id),
  CONSTRAINT FK_reserva_alojamiento FOREIGN KEY (id_alojamiento) REFERENCES alojamiento (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_reserva_fechas ON reserva(fecha_checkin, fecha_checkout);
CREATE INDEX idx_direccion_ciudad ON direccion(id_ciudad);
CREATE INDEX idx_alojamiento_precio ON alojamiento(precio_noche);
CREATE INDEX idx_alojamiento_capacidad ON alojamiento(capacidad_huespedes);

INSERT INTO usuario(username, password, email, nombre, apellido, telefono, dni, fecha_nacimiento, fecha_creacion, rol) VALUES("profe", "Profe123!", "profe@gmail.com", "profe", "de pp1", "3429999999", 12345678, '1900-01-01', '2025-7-11', 'ANFITRION');
INSERT INTO usuario(username, password, email, nombre, apellido, telefono, dni, fecha_nacimiento, fecha_creacion, rol) VALUES("ugas", "Agus123!", "agus_d_98@hotmail.com", "Agustina", "Di Pasquale", "3426312299", 41217247, '1998-06-18', '2025-7-11', 'HUESPED');
INSERT INTO usuario(username, password, email, nombre, apellido, telefono, dni, fecha_nacimiento, fecha_creacion, rol) VALUES("masi", "Masi123!", "maximorojas002@gmail.com", "Maximo", "Rojas", "3424426356", 46540433, '2005-04-15', '2025-7-11', 'HUESPED');
INSERT INTO usuario(username, password, email, nombre, apellido, telefono, dni, fecha_nacimiento, fecha_creacion, rol) VALUES("alan", "Alan123!", "alanacvd@gmail.com", "Alan", "Acevedo", "3421234423", 42313983, '2001-02-16', '2025-7-11', 'HUESPED');