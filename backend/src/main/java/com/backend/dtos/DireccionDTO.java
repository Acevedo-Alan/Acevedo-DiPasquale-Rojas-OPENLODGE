package com.backend.dtos;

import com.backend.Entities.Direccion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DireccionDTO {
    private Long id;
    private String calle;
    private Integer numero;
    private String depto;
    private Integer piso;
    private CiudadDTO ciudad;
    
    public static DireccionDTO fromEntity(Direccion direccion) {
        return DireccionDTO.builder()
            .id(direccion.getId())
            .calle(direccion.getCalle())
            .numero(direccion.getNumero())
            .depto(direccion.getDepto())
            .piso(direccion.getPiso())
            .ciudad(CiudadDTO.fromEntity(direccion.getCiudad()))
            .build();
    }
}