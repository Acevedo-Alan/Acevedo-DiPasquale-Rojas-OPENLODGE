package com.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Usuario;
import com.backend.Services.UsuarioService;
import com.backend.enums.Roles;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PutMapping("/{id}/rol")
    public ResponseEntity<?> cambiarRol(
            @PathVariable Long id,
            @RequestParam Roles nuevoRol) {
        try {
            Usuario usuario = usuarioService.cambiarRol(id, nuevoRol);
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.obtenerPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<?> obtenerPorUsername(@PathVariable String username) {
        try {
            Usuario usuario = usuarioService.obtenerPorUsername(username);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}