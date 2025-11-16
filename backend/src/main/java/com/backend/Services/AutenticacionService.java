package com.backend.Services;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.RegisterRequest;
import com.backend.enums.Roles;

import jakarta.validation.Valid;

@Service
public class AutenticacionService {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    public ResponseEntity<?> login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body("Credenciales inválidas");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("userId", usuario.getId());
        response.put("username", usuario.getUsername());
        response.put("rol", usuario.getRol().name());

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<?> registro(@Valid RegisterRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("El username ya está en uso");
        }
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsername(request.getUsername());
        nuevoUsuario.setPassword(request.getPassword());
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setApellido(request.getApellido());
        nuevoUsuario.setTelefono(request.getTelefono());
        nuevoUsuario.setDni(request.getDni());
        nuevoUsuario.setFechaNacimiento(request.getFechaNacimiento());
        nuevoUsuario.setFechaCreacion(LocalDate.now());
        nuevoUsuario.setRol(Roles.HUESPED);

        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);

        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Usuario registrado exitosamente");
        response.put("userId", usuarioGuardado.getId());
        response.put("username", usuarioGuardado.getUsername());
        response.put("rol", usuarioGuardado.getRol().name());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
