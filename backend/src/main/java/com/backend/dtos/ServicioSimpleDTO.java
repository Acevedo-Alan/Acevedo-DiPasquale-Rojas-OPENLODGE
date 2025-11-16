package com.backend.dtos;

import com.backend.Entities.Servicio;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ServicioSimpleDTO {
    private Long id;
    private String nombre;
    
    public static ServicioSimpleDTO fromEntity(Servicio servicio) {
        return ServicioSimpleDTO.builder()
            .id(servicio.getId())
            .nombre(servicio.getNombre())
            .build();
    }
}