package com.backend.Controllers;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Servicio;
import com.backend.Services.ServicioService;
import com.backend.dtos.ServicioDTO;
import com.backend.dtos.ServicioResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/servicios")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    // ========== ENDPOINTS PÚBLICOS ==========

    @GetMapping("/getAll")
    public ResponseEntity<List<ServicioResponseDTO>> obtenerTodosLosServicios() {
        List<Servicio> servicios = servicioService.obtenerTodosLosServicios();
        List<ServicioResponseDTO> response = servicios.stream()
            .map(ServicioResponseDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerServicioPorId(@PathVariable Long id) {
        try {
            Servicio servicio = servicioService.obtenerServicioPorId(id);
            return ResponseEntity.ok(ServicioResponseDTO.fromEntity(servicio));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ========== ENDPOINTS PROTEGIDOS (SOLO ADMINISTRADOR) ==========
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<?> crearServicio(@Valid @RequestBody ServicioDTO dto) {
        try {
            Servicio servicio = servicioService.crearServicio(dto);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ServicioResponseDTO.fromEntity(servicio));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<?> actualizarServicio(
            @PathVariable Long id,
            @Valid @RequestBody ServicioDTO dto) {
        try {
            Servicio servicio = servicioService.actualizarServicio(id, dto);
            return ResponseEntity.ok(ServicioResponseDTO.fromEntity(servicio));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('ADMINISTRADOR')")
    public ResponseEntity<?> eliminarServicio(@PathVariable Long id) {
        try {
            servicioService.eliminarServicio(id);
            return ResponseEntity.ok("Servicio eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}