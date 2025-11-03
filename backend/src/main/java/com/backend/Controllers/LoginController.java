package com.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/autenticacion")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class LoginController {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Como no hay seguridad, simplemente verificamos que las contraseñas coincidan
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

    // Clase interna para el request
    public static class LoginRequest {
        private String username;
        private String password;

        // Getters y setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}