package com.backend.dtos;

import java.util.Set;

import com.backend.Entities.Direccion;
import com.backend.Entities.Servicio;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AlojamientoDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 100, message = "La descripción no puede exceder 100 caracteres")
    private String descripcion;

    @NotBlank(message = "La imagen es obligatoria")
    @Size(max = 300, message = "La URL de la imagen no puede exceder 300 caracteres")
    private String imagen;

    @NotNull(message = "El precio por noche es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private Double precioNoche;

    @NotNull(message = "La capacidad de huéspedes es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    private Integer capacidadHuespedes;

    @NotNull(message = "La dirección es obligatoria")
    private Direccion direccion;

    private Set<Servicio> servicios;

    public AlojamientoDTO() {
    }

    public AlojamientoDTO(String nombre, String descripcion, String imagen, 
                         Double precioNoche, Integer capacidadHuespedes,
                         Direccion direccion, Set<Servicio> servicios) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.precioNoche = precioNoche;
        this.capacidadHuespedes = capacidadHuespedes;
        this.direccion = direccion;
        this.servicios = servicios;
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public Double getPrecioNoche() {
        return precioNoche;
    }

    public void setPrecioNoche(Double precioNoche) {
        this.precioNoche = precioNoche;
    }

    public Integer getCapacidadHuespedes() {
        return capacidadHuespedes;
    }

    public void setCapacidadHuespedes(Integer capacidadHuespedes) {
        this.capacidadHuespedes = capacidadHuespedes;
    }

    public Direccion getDireccion() {
        return direccion;
    }

    public void setDireccion(Direccion direccion) {
        this.direccion = direccion;
    }

    public Set<Servicio> getServicios() {
        return servicios;
    }

    public void setServicios(Set<Servicio> servicios) {
        this.servicios = servicios;
    }
}