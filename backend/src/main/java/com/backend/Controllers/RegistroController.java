package com.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.enums.Roles;

import java.time.LocalDate;

@RestController
@RequestMapping("/autenticacion")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class RegistroController {

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody RegistroRequest request) {
        try {
            if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso");
            }

            if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("El correo electrónico ya está registrado");
            }

            Usuario usuario = new Usuario();
            usuario.setNombre(request.getNombre());
            usuario.setApellido(request.getApellido());
            usuario.setUsername(request.getUsername());
            usuario.setEmail(request.getEmail());
            usuario.setPassword(request.getPassword()); // Sin encriptar ya que removimos la seguridad
            usuario.setFechaNacimiento(request.getFechaNacimiento());
            usuario.setFechaCreacion(LocalDate.now());
            usuario.setRol(Roles.HUESPED); // Rol por defecto

            Usuario savedUsuario = usuarioRepository.save(usuario);
            return ResponseEntity.ok(savedUsuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al registrar usuario: " + e.getMessage());
        }
    }

    // Clase interna para el request
    public static class RegistroRequest {
        private String nombre;
        private String apellido;
        private String username;
        private String email;
        private String password;
        private LocalDate fechaNacimiento;

        // Getters y setters
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getApellido() { return apellido; }
        public void setApellido(String apellido) { this.apellido = apellido; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public LocalDate getFechaNacimiento() { return fechaNacimiento; }
        public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    }
}