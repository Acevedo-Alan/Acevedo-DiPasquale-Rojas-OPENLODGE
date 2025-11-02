package com.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.Entities.Direccion;

@Repository
public interface IDireccionRepository extends JpaRepository<Direccion, Long> {
}