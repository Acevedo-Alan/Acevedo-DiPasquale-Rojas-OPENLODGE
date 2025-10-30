package com.backend.Entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ReservaId implements Serializable {
    
    @Column(name = "id_usuario")
    private Long usuarioId;
    
    @Column(name = "id_alojamiento")
    private Long alojamientoId;

    // Constructor vacío requerido por JPA
    public ReservaId() {
    }

    public ReservaId(Long usuarioId, Long alojamientoId) {
        this.usuarioId = usuarioId;
        this.alojamientoId = alojamientoId;
    }

    // equals() y hashCode() son CRÍTICOS para claves compuestas
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReservaId that = (ReservaId) o;
        return Objects.equals(usuarioId, that.usuarioId) &&
               Objects.equals(alojamientoId, that.alojamientoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, alojamientoId);
    }

    // Getters y Setters
    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getAlojamientoId() {
        return alojamientoId;
    }

    public void setAlojamientoId(Long alojamientoId) {
        this.alojamientoId = alojamientoId;
    }
}