package com.backend.Entities;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ReservaId implements Serializable {
    @Column(name = "id_alojamiento")
    private int alojamientoId;
    @Column(name = "id_usuario")
    private int usuarioId;

    public ReservaId() {
        // Constructor vacío requerido por JPA
    }

    public ReservaId(int usuarioId, int alojamientoId) {
        this.usuarioId = usuarioId;
        this.alojamientoId = alojamientoId;
    }

    // --- Métodos esenciales para Claves Compuestas ---

    // 4. Se debe implementar equals() y hashCode()
    // Esto es CRÍTICO para que Hibernate pueda identificar correctamente la clave.

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
    public int getusuarioId() {
        return usuarioId;
    }

    public void setusuarioId(int usuarioId) {
        this.usuarioId = usuarioId;
    }

    public int getalojamientoId() {
        return alojamientoId;
    }

    public void setalojamientoId(int alojamientoId) {
        this.alojamientoId = alojamientoId;
    }
}
