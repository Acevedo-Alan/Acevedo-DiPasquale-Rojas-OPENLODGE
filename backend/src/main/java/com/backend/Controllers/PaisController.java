package com.backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Pais;
import com.backend.Services.PaisService;

@RestController
@RequestMapping("/api/paises")
@CrossOrigin(
    origins = { "http://localhost:5500", "http://127.0.0.1:5500" },
    allowCredentials = "true"
)
public class PaisController {

    @Autowired
    private PaisService paisService;

    @PostMapping
    public ResponseEntity<?> crearPais(@RequestBody Pais pais) {
        try {
            Pais nuevoPais = paisService.crearOBuscar(pais.getNombre());
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPais);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> buscarPorNombre(@PathVariable String nombre) {
        try {
            Pais pais = paisService.buscarPorNombre(nombre);
            return ResponseEntity.ok(pais);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Pais>> obtenerTodos() {
        return ResponseEntity.ok(paisService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Pais pais = paisService.obtenerPorId(id);
            return ResponseEntity.ok(pais);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}