package com.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.RegisterRequest;
import com.backend.enums.Roles;

import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/autenticacion")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class AutenticationController {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            if (!usuario.getPassword().equals(request.getPassword())) {
                return ResponseEntity.badRequest().body("Credenciales inválidas");
            }

            // Crear respuesta con datos del usuario
            Map<String, Object> response = new HashMap<>();
            response.put("userId", usuario.getId());
            response.put("username", usuario.getUsername());
            response.put("rol", usuario.getRol().name());

            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegisterRequest request) {
        try {
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
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al registrar usuario: " + e.getMessage());
        }
    }

}