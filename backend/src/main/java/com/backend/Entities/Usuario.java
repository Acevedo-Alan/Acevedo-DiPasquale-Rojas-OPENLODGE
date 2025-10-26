package com.backend.Entities;

import java.util.Date;

import com.backend.enums.Roles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="usuario")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "Username", nullable = false, length = 100)
    private String username;
    @Column(name = "Password", nullable = false, length = 350)
    private String password;
    @Column(name = "Email", nullable = false, length = 100)
    private String email;
    @Column(name = "Nombre", nullable = false, length = 100)
    private String nombre;
    @Column(name = "Apellido", nullable = false, length = 100)
    private String apellido;
    @Column(name = "Fecha_nacimiento", nullable = false)
    private Date fechaNacimiento;
    @Column(name = "Fecha_creacion", nullable = false)
    private Date fechaCreacion;
    @Enumerated(EnumType.STRING)
    Roles rol;
}
