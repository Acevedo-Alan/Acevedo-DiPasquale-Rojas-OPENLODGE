package com.backend.Repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.Entities.Reserva;
import com.backend.Entities.ReservaId;

public interface IReservaRepository extends JpaRepository<Reserva, ReservaId> {
    
    // Buscar reservas por usuario
    @Query("SELECT r FROM Reserva r WHERE r.usuario.id = :usuarioId")
    List<Reserva> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    // Buscar reservas por alojamiento
    @Query("SELECT r FROM Reserva r WHERE r.alojamiento.id = :alojamientoId")
    List<Reserva> findByAlojamientoId(@Param("alojamientoId") Long alojamientoId);
    
    // Buscar reservas que se solapen con un rango de fechas
    @Query("SELECT r FROM Reserva r WHERE r.alojamiento.id = :alojamientoId " +
           "AND ((r.checkin <= :checkout AND r.checkout >= :checkin))")
    List<Reserva> findReservasEnRango(
        @Param("alojamientoId") Long alojamientoId,
        @Param("checkin") LocalDate checkin,
        @Param("checkout") LocalDate checkout
    );
    
    // Buscar reservas futuras de un alojamiento
    @Query("SELECT r FROM Reserva r WHERE r.alojamiento.id = :alojamientoId " +
           "AND r.checkin > :fecha")
    List<Reserva> findReservasFuturas(
        @Param("alojamientoId") Long alojamientoId,
        @Param("fecha") LocalDate fecha
    );
    
    // Buscar reservas pasadas de un usuario
    @Query("SELECT r FROM Reserva r WHERE r.usuario.id = :usuarioId " +
           "AND r.checkout < :fecha ORDER BY r.checkout DESC")
    List<Reserva> findReservasPasadas(
        @Param("usuarioId") Long usuarioId,
        @Param("fecha") LocalDate fecha
    );
}