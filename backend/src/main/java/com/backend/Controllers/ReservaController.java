package com.backend.Controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.Entities.Reserva;
import com.backend.Services.ReservaService;
import com.backend.dtos.ReservaDTO;
import com.backend.dtos.ReservaResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/crearReserva/usuario/{usuarioId}")
    public ResponseEntity<?> crearReserva(
            @PathVariable Long usuarioId,
            @Valid @RequestBody ReservaDTO dto) {
        try {
            Reserva reserva = reservaService.crearReserva(dto, usuarioId);
            ReservaResponseDTO response = ReservaResponseDTO.fromEntity(reserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/modificarReserva/usuario/{usuarioId}/alojamiento/{alojamientoId}")
    public ResponseEntity<?> modificarReserva(
            @PathVariable Long usuarioId,
            @PathVariable Long alojamientoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevoCheckin,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevoCheckout,
            @RequestParam Integer nuevosHuespedes) {
        try {
            Reserva reserva = reservaService.modificarReserva(
                    usuarioId, alojamientoId, nuevoCheckin, nuevoCheckout, nuevosHuespedes);
            ReservaResponseDTO response = ReservaResponseDTO.fromEntity(reserva);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cancelarReserva/usuario/{usuarioId}/alojamiento/{alojamientoId}")
    public ResponseEntity<?> cancelarReserva(
            @PathVariable Long usuarioId,
            @PathVariable Long alojamientoId) {
        try {
            reservaService.cancelarReserva(usuarioId, alojamientoId);
            return ResponseEntity.ok("Reserva cancelada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/historial/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerHistorialUsuario(@PathVariable Long usuarioId) {
        List<ReservaResponseDTO> reservas = reservaService.obtenerHistorialUsuario(usuarioId)
                .stream().map(ReservaResponseDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/historial/alojamiento/{alojamientoId}")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerHistorialAlojamiento(@PathVariable Long alojamientoId) {
        List<ReservaResponseDTO> reservas = reservaService.obtenerHistorialAlojamiento(alojamientoId)
                .stream().map(ReservaResponseDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/reservasPasadas/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerReservasPasadas(@PathVariable Long usuarioId) {
        List<ReservaResponseDTO> reservas = reservaService.obtenerReservasPasadas(usuarioId)
                .stream().map(ReservaResponseDTO::fromEntity).collect(Collectors.toList());
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/disponibilidad/{alojamientoId}")
    public ResponseEntity<?> verificarDisponibilidad(
            @PathVariable Long alojamientoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout) {
        boolean disponible = reservaService.verificarDisponibilidad(alojamientoId, checkin, checkout);
        return ResponseEntity.ok(new DisponibilidadResponse(disponible));
    }

    private static class DisponibilidadResponse {
        private boolean disponible;

        public DisponibilidadResponse(boolean disponible) {
            this.disponible = disponible;
        }

        public boolean isDisponible() {
            return disponible;
        }

        public void setDisponible(boolean disponible) {
            this.disponible = disponible;
        }
    }
}
