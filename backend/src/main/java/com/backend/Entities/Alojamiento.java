package com.backend.Entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "alojamiento")
@EqualsAndHashCode(exclude = {"anfitrion", "reservas", "servicios", "direccion"})
@ToString(exclude = {"anfitrion", "reservas", "servicios", "direccion"})
public class Alojamiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", nullable = false, length = 100)
    private String descripcion;

    @Column(name = "imagen", length = 300)
    private String imagen;

    @Column(name = "precio_noche", nullable = false)
    private Double precioNoche;

    @Column(name = "capacidad_huespedes", nullable = false)
    private Integer capacidadHuespedes;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fecha_modificacion", nullable = false)
    private LocalDate fechaModificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_anfitrion", referencedColumnName = "id", nullable = false)
    @JsonIgnoreProperties({"alojamientos", "reservas", "password", "email", "telefono", "dni", "fechaNacimiento"})
    private Usuario anfitrion;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "id_direccion", referencedColumnName = "id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Direccion direccion;

    @OneToMany(mappedBy = "alojamiento", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"alojamiento", "usuario"})
    private List<Reserva> reservas = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "servicio_alojamiento",
        joinColumns = @JoinColumn(name = "id_alojamiento"),
        inverseJoinColumns = @JoinColumn(name = "id_servicio")
    )
    @JsonIgnoreProperties({"alojamientos"})
    private Set<Servicio> servicios = new HashSet<>();
    
    // MÉTODOS HELPER PARA SINCRONIZAR RELACIÓN BIDIRECCIONAL
    
    public void addServicio(Servicio servicio) {
        this.servicios.add(servicio);
        servicio.getAlojamientos().add(this);
    }
    
    public void removeServicio(Servicio servicio) {
        this.servicios.remove(servicio);
        servicio.getAlojamientos().remove(this);
    }
    
    public void setServiciosSync(Set<Servicio> nuevosServicios) {
        // Limpiar servicios anteriores
        if (this.servicios != null) {
            new HashSet<>(this.servicios).forEach(this::removeServicio);
        }
        // Agregar nuevos servicios
        if (nuevosServicios != null) {
            nuevosServicios.forEach(this::addServicio);
        }
    }
}