package com.backend.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "direccion")
public class Direccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "calle", length = 100)
    private String calle;

    @Column(name = "numero")
    private Integer numero;

    @Column(name = "depto", length = 50)
    private String depto;

    @Column(name = "piso")
    private Integer piso;

    @ManyToOne
    @JoinColumn(name = "id_ciudad", referencedColumnName = "id")
    private Ciudad ciudad;
}