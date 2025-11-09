package com.backend.Controllers;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.Entities.Reserva;
import com.backend.Services.ReservaService;
import com.backend.dtos.ReservaDTO;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> crearReserva(
            @PathVariable Long usuarioId,
            @Valid @RequestBody ReservaDTO dto) {
        try {
            Reserva reserva = reservaService.crearReserva(dto, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/usuario/{usuarioId}/alojamiento/{alojamientoId}")
    public ResponseEntity<?> modificarReserva(
            @PathVariable Long usuarioId,
            @PathVariable Long alojamientoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevoCheckin,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevoCheckout,
            @RequestParam Integer nuevosHuespedes) {
        try {
            Reserva reserva = reservaService.modificarReserva(
                usuarioId, alojamientoId, nuevoCheckin, nuevoCheckout, nuevosHuespedes);
            return ResponseEntity.ok(reserva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/usuario/{usuarioId}/alojamiento/{alojamientoId}")
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

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerHistorialUsuario(@PathVariable Long usuarioId) {
        List<Reserva> reservas = reservaService.obtenerHistorialUsuario(usuarioId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/alojamiento/{alojamientoId}")
    public ResponseEntity<List<Reserva>> obtenerHistorialAlojamiento(@PathVariable Long alojamientoId) {
        List<Reserva> reservas = reservaService.obtenerHistorialAlojamiento(alojamientoId);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/usuario/{usuarioId}/reservasPasadas")
    public ResponseEntity<List<Reserva>> obtenerReservasPasadas(@PathVariable Long usuarioId) {
        List<Reserva> reservas = reservaService.obtenerReservasPasadas(usuarioId);
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