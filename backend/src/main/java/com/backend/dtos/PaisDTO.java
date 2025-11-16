package com.backend.dtos;

import com.backend.Entities.Pais;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaisDTO {
    private Long id;
    private String nombre;
    
    public static PaisDTO fromEntity(Pais pais) {
        return PaisDTO.builder()
            .id(pais.getId())
            .nombre(pais.getNombre())
            .build();
    }
}