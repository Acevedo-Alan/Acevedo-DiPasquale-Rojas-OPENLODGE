package com.backend.Controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Ciudad;
import com.backend.Services.CiudadService;

@RestController
@RequestMapping("/api/ciudades")
@CrossOrigin(
    origins = { "http://localhost:5500", "http://127.0.0.1:5500" },
    allowCredentials = "true"
)
public class CiudadController {

    @Autowired
    private CiudadService ciudadService;

    @PostMapping
    public ResponseEntity<?> crearCiudad(@RequestBody Map<String, Object> request) {
        try {
            String nombre = (String) request.get("nombre");
            Long paisId = Long.valueOf(request.get("paisId").toString());
            
            Ciudad nuevaCiudad = ciudadService.crearOBuscar(nombre, paisId);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaCiudad);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/nombre/{nombre}/pais/{paisId}")
    public ResponseEntity<?> buscarPorNombreYPais(
            @PathVariable String nombre,
            @PathVariable Long paisId) {
        try {
            Ciudad ciudad = ciudadService.buscarPorNombreYPais(nombre, paisId);
            return ResponseEntity.ok(ciudad);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Ciudad>> obtenerTodas() {
        return ResponseEntity.ok(ciudadService.obtenerTodas());
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarCiudad(
            @RequestParam String nombre,
            @RequestParam Long paisId) {
        try {
            Ciudad ciudad = ciudadService.buscarPorNombreYPais(nombre, paisId);
            return ResponseEntity.ok(ciudad);
        } catch (RuntimeException e) {
            return ResponseEntity.ok(null); // Retornamos null si no se encuentra
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Ciudad ciudad = ciudadService.obtenerPorId(id);
            return ResponseEntity.ok(ciudad);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/pais/{paisId}")
    public ResponseEntity<List<Ciudad>> obtenerPorPais(@PathVariable Long paisId) {
        return ResponseEntity.ok(ciudadService.obtenerPorPais(paisId));
    }
}