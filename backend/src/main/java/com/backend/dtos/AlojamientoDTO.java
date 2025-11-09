package com.backend.dtos;

import java.util.Set;

import com.backend.Entities.Direccion;
import com.backend.Entities.Servicio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlojamientoDTO {
    private String nombre;
    private String descripcion;
    private String imagen;
    private Double precioNoche;
    private Integer capacidadHuespedes;
    private Direccion direccion;
    private Set<Servicio> servicios;
}