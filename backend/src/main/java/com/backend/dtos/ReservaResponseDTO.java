package com.backend.dtos;

import java.time.LocalDate;

import com.backend.Entities.Reserva;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaResponseDTO {

    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioApellido;
    
    private Long alojamientoId;
    private String alojamientoNombre;
    
    private LocalDate checkin;
    private LocalDate checkout;
    private Integer huespedes;
    private Double importe;
    private LocalDate fechaCreacion;
    private LocalDate fechaModificacion;

    public static ReservaResponseDTO fromEntity(Reserva reserva) {
        if (reserva == null) return null;

        return ReservaResponseDTO.builder()
                .usuarioId(reserva.getUsuario() != null ? reserva.getUsuario().getId() : null)
                .usuarioNombre(reserva.getUsuario() != null ? reserva.getUsuario().getNombre() : null)
                .usuarioApellido(reserva.getUsuario() != null ? reserva.getUsuario().getApellido() : null)
                .alojamientoId(reserva.getAlojamiento() != null ? reserva.getAlojamiento().getId() : null)
                .alojamientoNombre(reserva.getAlojamiento() != null ? reserva.getAlojamiento().getNombre() : null)
                .checkin(reserva.getCheckin())
                .checkout(reserva.getCheckout())
                .huespedes(reserva.getHuespedes())
                .importe(reserva.getImporte())
                .fechaCreacion(reserva.getFechaCreacion())
                .fechaModificacion(reserva.getFechaModificacion())
                .build();
    }
}