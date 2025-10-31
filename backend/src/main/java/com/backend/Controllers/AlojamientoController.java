package com.backend.Controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Alojamiento;
import com.backend.Entities.Reserva;
import com.backend.Services.AlojamientoService;
import com.backend.dtos.AlojamientoDTO;

@RestController
@RequestMapping("/api/alojamientos")
@CrossOrigin(origins = "*")
public class AlojamientoController {

    @Autowired
    private AlojamientoService alojamientoService;

    @PostMapping
    public ResponseEntity<?> crearAlojamiento(
            @RequestBody AlojamientoDTO dto,
            @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            Alojamiento alojamiento = alojamientoService.crearAlojamiento(dto, jwtToken);
            return ResponseEntity.status(HttpStatus.CREATED).body(alojamiento);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Alojamiento>> getAlojamientos() {
        List<Alojamiento> alojamientos = alojamientoService.getAlojamientos();
        return ResponseEntity.ok(alojamientos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAlojamientoById(@PathVariable Long id) {
        try {
            Alojamiento alojamiento = alojamientoService.getAlojamientoById(id);
            return ResponseEntity.ok(alojamiento);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/anfitrion/{anfitrionId}")
    public ResponseEntity<List<Alojamiento>> getAlojamientosPorAnfitrion(
            @PathVariable Long anfitrionId) {
        List<Alojamiento> alojamientos = alojamientoService.getAlojamientosPorAnfitrion(anfitrionId);
        return ResponseEntity.ok(alojamientos);
    }

    @GetMapping("/{alojamientoId}/disponibilidad")
    public ResponseEntity<List<Reserva>> getAlojamientosPorDisponibilidad(
            @PathVariable Long alojamientoId) {
        List<Reserva> reservas = alojamientoService.getAlojamientosPorDisponibilidad(alojamientoId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Alojamiento>> buscarDisponibles(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout,
            @RequestParam(required = false) Integer capacidadMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) Long ciudadId) {
        List<Alojamiento> disponibles = alojamientoService.buscarDisponibles(
            checkin, checkout, capacidadMin, precioMax, ciudadId);
        return ResponseEntity.ok(disponibles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAlojamiento(
            @PathVariable Long id,
            @RequestBody AlojamientoDTO dto,
            @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            Alojamiento alojamiento = alojamientoService.actualizarAlojamiento(id, dto, jwtToken);
            return ResponseEntity.ok(alojamiento);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAlojamiento(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            alojamientoService.eliminarAlojamiento(id, jwtToken);
            return ResponseEntity.ok("Alojamiento eliminado exitosamente");
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}