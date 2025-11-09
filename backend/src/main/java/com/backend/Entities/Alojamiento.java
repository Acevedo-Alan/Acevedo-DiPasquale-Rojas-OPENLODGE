package com.backend.Entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@EqualsAndHashCode(exclude = {"anfitrion", "reservas", "servicios"})
@ToString(exclude = {"anfitrion", "reservas", "servicios"})
public class Alojamiento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", nullable = false, length = 100)
    private String descripcion;

    @Column(name = "imagen", nullable = false, length = 300)
    private String imagen;

    @Column(name = "precio_noche", nullable = false)
    private Double precioNoche;

    @Column(name = "capacidad_huespedes")
    private Integer capacidadHuespedes;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Column(name = "fecha_modificacion", nullable = false)
    private LocalDate fechaModificacion;

    @ManyToOne(fetch = FetchType.EAGER)  // ✅ EAGER para cargar anfitrión siempre
    @JoinColumn(name = "id_anfitrion", referencedColumnName = "id")
    @JsonBackReference("alojamiento-usuario")
    private Usuario anfitrion;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)  // ✅ EAGER para dirección
    @JoinColumn(name = "id_direccion", referencedColumnName = "id")
    private Direccion direccion;

    @OneToMany(mappedBy = "alojamiento", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("alojamiento-reservas")
    private List<Reserva> reservas = new ArrayList<>();

    // ✅ CRÍTICO: Cambiar a EAGER para evitar lazy loading issues
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "servicio_alojamiento",
        joinColumns = @JoinColumn(name = "id_alojamiento"),
        inverseJoinColumns = @JoinColumn(name = "id_servicio")
    )
    private Set<Servicio> servicios = new HashSet<>();
}
