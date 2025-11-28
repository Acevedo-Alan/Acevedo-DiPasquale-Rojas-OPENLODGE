package com.backend.Controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Alojamiento;
import com.backend.Entities.Reserva;
import com.backend.Entities.Usuario;
import com.backend.Services.AlojamientoService;
import com.backend.dtos.AlojamientoDTO;
import com.backend.dtos.AlojamientoResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/alojamientos")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class AlojamientoController {

    @Autowired
    private AlojamientoService alojamientoService;

    // ========== ENDPOINTS PÚBLICOS ==========

    @GetMapping("/getAlojamientos")
    public ResponseEntity<List<AlojamientoResponseDTO>> getAlojamientos() {
        List<Alojamiento> alojamientos = alojamientoService.getAlojamientos();
        
        return ResponseEntity.ok(
            alojamientos.stream()
                .map(AlojamientoResponseDTO::fromEntity)
                .collect(Collectors.toList())
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getAlojamientoById(@PathVariable Long id) {
        try {
            Alojamiento alojamiento = alojamientoService.getAlojamientoById(id);
            return ResponseEntity.ok(AlojamientoResponseDTO.fromEntity(alojamiento));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Alojamiento no encontrado: " + e.getMessage());
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<AlojamientoResponseDTO>> buscarDisponibles(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout,
            @RequestParam(required = false) Integer capacidadMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) Long ciudadId) {

        List<Alojamiento> disponibles = alojamientoService.buscarDisponibles(
            checkin, checkout, capacidadMin, precioMax, ciudadId
        );

        return ResponseEntity.ok(
            disponibles.stream()
                .map(AlojamientoResponseDTO::fromEntity)
                .collect(Collectors.toList())
        );
    }

    // ========== ENDPOINTS PROTEGIDOS (ANFITRIÓN) ==========

    // Crear alojamiento (solo ANFITRION)
    @PostMapping("/crearAlojamiento")
    @PreAuthorize("hasAuthority('ANFITRION')")
    public ResponseEntity<?> crearAlojamiento(
            @Valid @RequestBody AlojamientoDTO dto,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            Long anfitrionId = usuario.getId();

            Alojamiento alojamiento = alojamientoService.crearAlojamiento(dto, anfitrionId);

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(AlojamientoResponseDTO.fromEntity(alojamiento));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Obtener alojamientos del anfitrión autenticado (solo ANFITRION)
    @GetMapping("/anfitrion")
    @PreAuthorize("hasAuthority('ANFITRION')")
    public ResponseEntity<List<AlojamientoResponseDTO>> getAlojamientosPorAnfitrion(
            Authentication authentication) {

        Usuario usuario = (Usuario) authentication.getPrincipal();
        Long anfitrionId = usuario.getId();

        List<Alojamiento> alojamientos = alojamientoService.getAlojamientosPorAnfitrion(anfitrionId);

        return ResponseEntity.ok(
            alojamientos.stream()
                .map(AlojamientoResponseDTO::fromEntity)
                .collect(Collectors.toList())
        );
    }

    // Actualizar alojamiento (solo ANFITRION propietario)
    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAuthority('ANFITRION')")
    public ResponseEntity<?> actualizarAlojamiento(
            @PathVariable Long id,
            @Valid @RequestBody AlojamientoDTO dto,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            Long anfitrionId = usuario.getId();

            Alojamiento alojamiento = alojamientoService.actualizarAlojamiento(id, dto, anfitrionId);

            return ResponseEntity.ok(AlojamientoResponseDTO.fromEntity(alojamiento));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Eliminar alojamiento (solo ANFITRION propietario)
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('ANFITRION')")
    public ResponseEntity<?> eliminarAlojamiento(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            Long anfitrionId = usuario.getId();

            alojamientoService.eliminarAlojamiento(id, anfitrionId);

            return ResponseEntity.ok("Alojamiento eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}