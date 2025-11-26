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
public class ServicioResponseDTO {
    
    private Long id;
    private String nombre;
    
    public static ServicioResponseDTO fromEntity(Servicio servicio) {
        if (servicio == null) return null;
        
        return ServicioResponseDTO.builder()
            .id(servicio.getId())
            .nombre(servicio.getNombre())
            .build();
    }
}