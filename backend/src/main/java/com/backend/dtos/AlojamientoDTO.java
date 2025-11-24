package com.backend.dtos;

import java.util.Set;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlojamientoDTO {
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 100, message = "La descripción no puede exceder 100 caracteres")
    private String descripcion;
    
    @Size(max = 300, message = "La URL de la imagen no puede exceder 300 caracteres")
    private String imagen;
    
    @NotNull(message = "El precio por noche es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private Double precioNoche;
    
    @NotNull(message = "La capacidad de huéspedes es obligatoria")
    @Min(value = 1, message = "Debe haber al menos 1 huésped")
    private Integer capacidadHuespedes;
    
    @NotBlank(message = "La calle es obligatoria")
    private String calle;
    
    @NotNull(message = "El número es obligatorio")
    private Integer numero;
    
    private String depto;

    private Integer piso;
    
    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;
    
    @NotBlank(message = "El país es obligatorio")
    private String pais;
    
    private Set<Long> serviciosId;
}