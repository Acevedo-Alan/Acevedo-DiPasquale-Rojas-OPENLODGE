package com.backend.dtos;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservaDTO {

    @NotNull(message = "El ID del alojamiento es obligatorio")
    private Long alojamientoId;

    @NotNull(message = "La fecha de check-in es obligatoria")
    @FutureOrPresent(message = "La fecha de check-in debe ser presente o futura")
    private LocalDate checkin;

    @NotNull(message = "La fecha de check-out es obligatoria")
    @Future(message = "La fecha de check-out debe ser futura")
    private LocalDate checkout;

    @NotNull(message = "La cantidad de huéspedes es obligatoria")
    @Min(value = 1, message = "Debe haber al menos 1 huésped")
    private Integer huespedes;
}