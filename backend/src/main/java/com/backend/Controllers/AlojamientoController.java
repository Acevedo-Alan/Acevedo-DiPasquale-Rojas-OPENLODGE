package com.backend.Controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Alojamiento;
import com.backend.Entities.Reserva;
import com.backend.Services.AlojamientoService;
import com.backend.dtos.AlojamientoDTO;

@RestController
@RequestMapping("/alojamientos")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class AlojamientoController {

    @Autowired
    private AlojamientoService alojamientoService;

    @PostMapping("/crearAlojamiento")
    public ResponseEntity<?> crearAlojamiento(@RequestBody AlojamientoDTO dto, @RequestParam Long id) {
        try {
            Alojamiento alojamiento = alojamientoService.crearAlojamiento(dto, id);
            return ResponseEntity.status(HttpStatus.CREATED).body(alojamiento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/getAll")
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
            @RequestBody AlojamientoDTO dto) {
        try {
            Alojamiento alojamiento = alojamientoService.actualizarAlojamiento(id, dto);
            return ResponseEntity.ok(alojamiento);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAlojamiento(@PathVariable Long id) {
        try {
            alojamientoService.eliminarAlojamiento(id);
            return ResponseEntity.ok("Alojamiento eliminado exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}