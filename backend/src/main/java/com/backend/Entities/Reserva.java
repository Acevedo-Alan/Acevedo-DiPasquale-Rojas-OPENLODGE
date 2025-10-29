package com.backend.Entities;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reserva", uniqueConstraints = {@UniqueConstraint(columnNames = {"id_usuario", "id_alojamiento"})})
public class Reserva {

    @Embedded
    private ReservaId reservaId;
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuarioId;
    @ManyToOne
    @JoinColumn(name = "id_alojamiento")
    private Alojamiento alojamientoId;

    @Column(name = "fecha_checkin")
    private LocalDate checkin;
    @Column(name = "fecha_checkout")
    private LocalDate checkout;
    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion;
    @Column(name = "fecha_modificacion")
    private LocalDate fechaModificacion;
    
}
