# Acevedo-DiPasquale-Rojas-OPENLODGE
# Rama a ejecutar: "no-security"
# Dependencias: MySQL connector, Jpa, lombok, devtools, spring web
# Java version: 17
# Maven version: 4.0.0
# Spring-boot version: 3.5.6
# Estructura del proyecto:
OpenLodge/
 ├── backend/
 │   ├── .mvn/
 │   ├── src/
 │   │   ├── main/
 │   │   │   ├── java/com/backend/
 │   │   │   │   ├── config/
 │   │   │   │   ├── Controllers/
 │   │   │   │   ├── dtos/
 │   │   │   │   ├── Entities/
 │   │   │   │   ├── enums/
 │   │   │   │   ├── Repositories/
 │   │   │   │   ├── Services/
 │   │   │   │   └── BackendApplication.java
 │   │   │   └── resources/
 │   │   └── test/
 │   ├── target/
 │   └── pom.xml
 │
 └── frontend/
    ├── components/
    │   ├── carrusel/
    │   ├── FeedPropiedades/
    │   ├── footer/
    │   ├── header/
    │   └── popup/
    │
    ├── pages/
    │   ├── agregarPropiedad/
    │   ├── alojamiento/
    │   │   ├── formularioReserva/
    │   │   └── modificarReserva/
    │   │
    │   ├── autenticacion/
    │   │   ├── login/
    │   │   └──registro/
    │   ├── index/
    │   ├── modificarPropiedad/
    │   └── perfil/
    │        └── historial/
    └── services/

# Pasos para levantar el proyecto:
# BACKEND:
1. Estar en la rama "no-security"
2. Asegurarse de tener la base de datos del script de openlodgedb
3. Modificar application.properties del springboot y colocar la contraseña y usuario segun su configuracion de xampp # o el sistema de gestion de base de datos usuado
4. Runnear el BackendApplication.java

# FRONTEND:
1. Abrir el index.html con live server
2. Puede crear un nuevo usuario(por defecto huesped) o puede iniciar como anfitrion con el usuario creado previamente en el script usado para crear la base de datos.
 
# El unico usuario anfitrion es "profe", es el unico con el que se puede probar crear alojamientos.

# Implementaciones a futuro:
-Seguridad: encriptado de contraseñas, tokenizacion y proteccion de endpoints
-Pantallas graficas para que el administrador pueda gestionar quien es anfitrion y quien es huesped.
-Buscado de propiedades por filtros
