package com.backend.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.Entities.Usuario;
import com.backend.enums.Roles;

import java.util.List;

public interface IUsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findById(Long id);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<Usuario> findByRol(Roles rol);
}