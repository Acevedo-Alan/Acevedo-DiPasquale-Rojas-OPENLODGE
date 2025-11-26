package com.backend.dtos;

import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;
import com.backend.Entities.Alojamiento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlojamientoResponseDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String imagen;
    private Double precioNoche;
    private Integer capacidadHuespedes;
    private LocalDate fechaCreacion;
    private LocalDate fechaModificacion;
    
    private Long anfitrionId;
    private String anfitrionNombre;
    private String anfitrionApellido;
    
    // Dirección completa
    private DireccionDTO direccion;
    
    // Servicios
    private Set<ServicioResponseDTO> servicios;
   
    public static AlojamientoResponseDTO fromEntity(Alojamiento alojamiento) {
        return AlojamientoResponseDTO.builder()
            .id(alojamiento.getId())
            .nombre(alojamiento.getNombre())
            .descripcion(alojamiento.getDescripcion())
            .imagen(alojamiento.getImagen())
            .precioNoche(alojamiento.getPrecioNoche())
            .capacidadHuespedes(alojamiento.getCapacidadHuespedes())
            .fechaCreacion(alojamiento.getFechaCreacion())
            .fechaModificacion(alojamiento.getFechaModificacion())
            .anfitrionId(alojamiento.getAnfitrion().getId())
            .anfitrionNombre(alojamiento.getAnfitrion().getNombre())
            .anfitrionApellido(alojamiento.getAnfitrion().getApellido())
            .direccion(DireccionDTO.fromEntity(alojamiento.getDireccion()))
            .servicios(alojamiento.getServicios().stream()
                .map(ServicioResponseDTO::fromEntity)
                .collect(Collectors.toSet()))
            .build();
    }
}