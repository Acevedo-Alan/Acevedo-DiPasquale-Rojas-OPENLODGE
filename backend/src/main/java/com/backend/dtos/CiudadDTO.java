package com.backend.dtos;

import com.backend.Entities.Ciudad;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CiudadDTO {
    private Long id;
    private String nombre;
    private PaisDTO pais;
    
    public static CiudadDTO fromEntity(Ciudad ciudad) {
        return CiudadDTO.builder()
            .id(ciudad.getId())
            .nombre(ciudad.getNombre())
            .pais(PaisDTO.fromEntity(ciudad.getPais()))
            .build();
    }
}