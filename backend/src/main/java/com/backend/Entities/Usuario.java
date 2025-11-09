package com.backend.Entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.backend.enums.Roles;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usuario")
public class Usuario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, length = 100, unique = true)
    private String username;

    @Column(name = "password", nullable = false, length = 350)
    private String password;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "dni", nullable = false, unique = true)
    private int dni;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDate fechaCreacion;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false, length = 50)
    private Roles rol;

    @OneToMany(mappedBy = "usuario", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonManagedReference("usuario-reservas")
    private List<Reserva> reservas = new ArrayList<>();

    @OneToMany(mappedBy = "anfitrion", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonManagedReference("alojamiento-usuario")
    private List<Alojamiento> alojamientos = new ArrayList<>();
}