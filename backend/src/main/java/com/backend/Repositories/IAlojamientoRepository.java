package com.backend.Repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.Entities.Alojamiento;

public interface IAlojamientoRepository extends JpaRepository<Alojamiento, Long> {
    
    // Buscar alojamientos por anfitrión
    List<Alojamiento> findByAnfitrionId(Long anfitrionId);
    
    // Buscar alojamientos por ciudad
    @Query("SELECT a FROM Alojamiento a WHERE a.direccion.ciudad.id = :ciudadId")
    List<Alojamiento> findByCiudadId(@Param("ciudadId") Long ciudadId);
    
    // Buscar alojamientos disponibles en un rango de fechas
    @Query("SELECT a FROM Alojamiento a WHERE a.id NOT IN " +
           "(SELECT r.alojamiento.id FROM Reserva r WHERE " +
           "(r.checkin <= :checkout AND r.checkout >= :checkin))")
    List<Alojamiento> findDisponiblesEnRango(
        @Param("checkin") LocalDate checkin,
        @Param("checkout") LocalDate checkout
    );
    
    List<Alojamiento> findByNombre(String nombre);
}