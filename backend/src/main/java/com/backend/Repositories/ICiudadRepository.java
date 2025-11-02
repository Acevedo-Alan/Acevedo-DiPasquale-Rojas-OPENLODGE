package com.backend.Repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.Entities.Ciudad;

@Repository
public interface ICiudadRepository extends JpaRepository<Ciudad, Long> {
    Optional<Ciudad> findByNombreAndPaisId(String nombre, Long paisId);
    List<Ciudad> findByPaisId(Long paisId);
}