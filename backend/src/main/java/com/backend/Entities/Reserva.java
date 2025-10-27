package com.backend.Entities;

import java.time.LocalDate;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
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
    @Embedded
    private ReservaIdUtil idReserva;

    @OneToMany
    @MapsId("id_usuario")
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;



    
    public Reserva(Usuario usuario, Alojamiento alojamiento, LocalDate fechaReserva) {
        this.idReserva = new ReservaIdUtil(usuario.getId(), alojamiento.getId());
        this.usuario = usuario;
        this.alojamiento = alojamiento;
        this.fechaReserva = fechaReserva;
    }
}
