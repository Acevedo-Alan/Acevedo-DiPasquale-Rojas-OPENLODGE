package com.backend.Entities;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reserva")
public class Reserva {

    @EmbeddedId
    private ReservaId id;

    @ManyToOne
    @MapsId("usuarioId")
    @JoinColumn(name = "id_usuario")
    @JsonBackReference("usuario-reservas")
    private Usuario usuario;

    @ManyToOne
    @MapsId("alojamientoId")
    @JoinColumn(name = "id_alojamiento")
    @JsonBackReference("alojamiento-reservas")
    private Alojamiento alojamiento;

    @Column(name = "fecha_checkin", nullable = false)
    private LocalDate checkin;

    @Column(name = "fecha_checkout", nullable = false)
    private LocalDate checkout;

    @Column(name = "huespedes", nullable = false)
    private Integer huespedes;

    @Column(name = "importe")
    private Double importe;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fecha_modificacion", nullable = false)
    private LocalDate fechaModificacion;
}