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
    @Column(name = "username", nullable = false, length = 100)
    private String username;
    @Column(name = "password", nullable = false, length = 350)
    private String password;
    @Column(name = "email", nullable = false, length = 100)
    private String email;
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;
    @Column(name = "fecha_nacimiento", nullable = false)
    private Date fechaNacimiento;
    @Column(name = "fecha_creacion", nullable = false)
    private Date fechaCreacion;
    @Enumerated(EnumType.STRING)
    Roles rol;
}
