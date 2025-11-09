package com.backend.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReservaDTO {

    @NotNull()
    private Long alojamientoId;

    @NotNull()
    private Long huespedId;

    @NotNull(message = "La fecha de check-in es obligatoria")
    @FutureOrPresent(message = "La fecha de check-in debe ser presente o futura")
    private LocalDate checkin;

    @NotNull(message = "La fecha de check-out es obligatoria")
    @Future(message = "La fecha de check-out debe ser futura")
    private LocalDate checkout;

    @NotNull(message = "La cantidad de huéspedes es obligatoria")
    @Min(value = 1, message = "Debe haber al menos 1 huésped")
    private Integer huespedes;

    public ReservaDTO() {
    }

    public ReservaDTO(Long alojamientoId, Long huespedId, LocalDate checkin, LocalDate checkout, Integer huespedes) {
        this.alojamientoId = alojamientoId;
        this.huespedId = huespedId;
        this.checkin = checkin;
        this.checkout = checkout;
        this.huespedes = huespedes;
    }

    public Long getAlojamientoId() {
        return alojamientoId;
    }

    public void setAlojamientoId(Long alojamientoId) {
        this.alojamientoId = alojamientoId;
    }

    public LocalDate getCheckin() {
        return checkin;
    }

    public void setCheckin(LocalDate checkin) {
        this.checkin = checkin;
    }

    public LocalDate getCheckout() {
        return checkout;
    }

    public void setCheckout(LocalDate checkout) {
        this.checkout = checkout;
    }

    public Integer getHuespedes() {
        return huespedes;
    }

    public void setHuespedes(Integer huespedes) {
        this.huespedes = huespedes;
    }

    public Long getHuespedId() {
        return huespedId;
    }

    public void setHuespedId(Long huespedId) {
        this.huespedId = huespedId;
    }
}
