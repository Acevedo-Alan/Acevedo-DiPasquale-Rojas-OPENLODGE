package com.backend.Repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.backend.Entities.Ciudad;
import com.backend.Entities.Pais;

@Repository
public interface ICiudadRepository extends JpaRepository<Ciudad, Long> {

    Optional<Ciudad> findByNombreAndPaisId(String nombre, Long paisId);

    List<Ciudad> findByPaisId(Long paisId);
    
    @Query("SELECT c FROM Ciudad c WHERE c.nombre = :nombre AND c.pais = :pais")
    Optional<Ciudad> findByNombreAndPais(@Param("nombre") String nombre, @Param("pais") Pais pais);
}