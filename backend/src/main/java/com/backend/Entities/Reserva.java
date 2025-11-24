package com.backend.Entities;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reserva")
@EqualsAndHashCode(exclude = {"usuario", "alojamiento"})
@ToString(exclude = {"usuario", "alojamiento"})
public class Reserva {

    @EmbeddedId
    private ReservaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("usuarioId")
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"reservas", "alojamientos", "password", "email"})
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("alojamientoId")
    @JoinColumn(name = "id_alojamiento")
    @JsonIgnoreProperties({"reservas", "anfitrion", "servicios"})
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