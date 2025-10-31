package com.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ServicioDTO {

    @NotBlank(message = "El nombre del servicio es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    public ServicioDTO(){}

    public ServicioDTO(String nombre) {
        this.nombre = nombre;
    }
    
    public String getNombre(){return nombre;}
    public void setNombre(String nombre){this.nombre = nombre;}
}