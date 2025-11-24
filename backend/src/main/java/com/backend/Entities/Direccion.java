package com.backend.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "direccion")
@EqualsAndHashCode(exclude = {"ciudad"})
@ToString(exclude = {"ciudad"})
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ciudad", referencedColumnName = "id")
    @JsonIgnoreProperties({"direcciones"})
    private Ciudad ciudad;
}