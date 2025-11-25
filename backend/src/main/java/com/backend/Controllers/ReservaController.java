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

import com.backend.Entities.Reserva;
import com.backend.Entities.Usuario;
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

    // ========== ENDPOINTS PÚBLICOS ==========

    @GetMapping("/disponibilidad/{alojamientoId}")
    public ResponseEntity<?> verificarDisponibilidad(
            @PathVariable Long alojamientoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkin,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkout) {
        try {
            boolean disponible = reservaService.verificarDisponibilidad(alojamientoId, checkin, checkout);
            return ResponseEntity.ok(new DisponibilidadResponse(disponible));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ========== ENDPOINTS PROTEGIDOS ==========

    @PostMapping("/crearReserva")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> crearReserva(
            @Valid @RequestBody ReservaDTO dto,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            Long usuarioId = usuario.getId();

            Reserva reserva = reservaService.crearReserva(dto, usuarioId);
            ReservaResponseDTO response = ReservaResponseDTO.fromEntity(reserva);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/historial/usuario")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReservaResponseDTO>> obtenerHistorialUsuario(
            Authentication authentication) {
        
        Usuario usuario = (Usuario) authentication.getPrincipal();
        Long usuarioId = usuario.getId();

        List<ReservaResponseDTO> reservas = reservaService.obtenerHistorialUsuario(usuarioId)
                .stream()
                .map(ReservaResponseDTO::fromEntity)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(reservas);
    }


    @PutMapping("/modificarReserva/alojamiento/{alojamientoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> modificarReserva(
            @PathVariable Long alojamientoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevoCheckin,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevoCheckout,
            @RequestParam Integer nuevosHuespedes,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            Long usuarioId = usuario.getId();

            Reserva reserva = reservaService.modificarReserva(
                    usuarioId, alojamientoId, nuevoCheckin, nuevoCheckout, nuevosHuespedes);
            
            ReservaResponseDTO response = ReservaResponseDTO.fromEntity(reserva);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cancelarReserva/alojamiento/{alojamientoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> cancelarReserva(
            @PathVariable Long alojamientoId,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            Long usuarioId = usuario.getId();

            reservaService.cancelarReserva(usuarioId, alojamientoId);
            return ResponseEntity.ok("Reserva cancelada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/historial/alojamiento/{alojamientoId}")
    @PreAuthorize("hasAuthority('ANFITRION')")
    public ResponseEntity<?> obtenerHistorialAlojamiento(
            @PathVariable Long alojamientoId,
            Authentication authentication) {
        try {
            Usuario usuario = (Usuario) authentication.getPrincipal();
            
            // Verificar que el alojamiento pertenezca al anfitrión
            List<Reserva> reservas = reservaService.obtenerHistorialAlojamiento(
                    alojamientoId, usuario.getId());
            
            List<ReservaResponseDTO> response = reservas.stream()
                    .map(ReservaResponseDTO::fromEntity)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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