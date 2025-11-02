package com.backend.Repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.Entities.Servicio;

@Repository
public interface IServicioRepository extends JpaRepository<Servicio, Long> {
    boolean existsByNombre(String nombre);
    Optional<Servicio> findByNombre(String nombre);
}