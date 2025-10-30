package com.backend.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.Entities.Servicio;

public interface IServicioRepository extends JpaRepository<Servicio, Long> {
    
    Optional<Servicio> findByNombre(String nombre);
    
    boolean existsByNombre(String nombre);
}