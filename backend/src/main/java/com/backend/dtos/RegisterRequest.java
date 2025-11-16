package com.backend.dtos;

import java.time.LocalDate;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    
    private String username;
    private String password;
    private String email;
    private String nombre;
    private String apellido;
    private String telefono;
    private int dni;
    private LocalDate fechaNacimiento;
}