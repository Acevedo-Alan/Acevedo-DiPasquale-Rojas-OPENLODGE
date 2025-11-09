package com.backend.Controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.Entities.Alojamiento;
import com.backend.Entities.Reserva;
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

    @PostMapping("/crearAlojamiento")
    public ResponseEntity<?> crearAlojamiento(
            @Valid @RequestBody AlojamientoDTO dto, 
            @RequestParam Long anfitrionId) {
        try {
            Alojamiento alojamiento = alojamientoService.crearAlojamiento(dto, anfitrionId);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(AlojamientoResponseDTO.fromEntity(alojamiento));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<AlojamientoResponseDTO>> getAlojamientos() {
        List<Alojamiento> alojamientos = alojamientoService.getAlojamientos();
        List<AlojamientoResponseDTO> response = alojamientos.stream()
            .map(AlojamientoResponseDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAlojamiento/{id}")
    public ResponseEntity<?> getAlojamientoById(@PathVariable Long id) {
        try {
            Alojamiento alojamiento = alojamientoService.getAlojamientoById(id);
            return ResponseEntity.ok(AlojamientoResponseDTO.fromEntity(alojamiento));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/anfitrion/{anfitrionId}")
    public ResponseEntity<List<AlojamientoResponseDTO>> getAlojamientosPorAnfitrion(
            @PathVariable Long anfitrionId) {
        List<Alojamiento> alojamientos = alojamientoService.getAlojamientosPorAnfitrion(anfitrionId);
        List<AlojamientoResponseDTO> response = alojamientos.stream()
            .map(AlojamientoResponseDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{alojamientoId}/disponibilidad")
    public ResponseEntity<List<Reserva>> getAlojamientosPorDisponibilidad(
            @PathVariable Long alojamientoId) {
        List<Reserva> reservas = alojamientoService.getAlojamientosPorDisponibilidad(alojamientoId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<AlojamientoResponseDTO>> buscarDisponibles(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout,
            @RequestParam(required = false) Integer capacidadMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) Long ciudadId) {
        List<Alojamiento> disponibles = alojamientoService.buscarDisponibles(
            checkin, checkout, capacidadMin, precioMax, ciudadId);
        List<AlojamientoResponseDTO> response = disponibles.stream()
            .map(AlojamientoResponseDTO::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/actualizarAlojamiento")
    public ResponseEntity<?> actualizarAlojamiento(
            @PathVariable Long id,
            @Valid @RequestBody AlojamientoDTO dto,
            @RequestParam Long anfitrionId) {
        try {
            Alojamiento alojamiento = alojamientoService.actualizarAlojamiento(id, dto, anfitrionId);
            return ResponseEntity.ok(AlojamientoResponseDTO.fromEntity(alojamiento));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAlojamiento(
            @PathVariable Long id,
            @RequestParam Long anfitrionId) {
        try {
            alojamientoService.eliminarAlojamiento(id, anfitrionId);
            return ResponseEntity.ok("Alojamiento eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}