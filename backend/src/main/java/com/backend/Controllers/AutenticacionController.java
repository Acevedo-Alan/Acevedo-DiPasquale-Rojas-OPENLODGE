package com.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.Services.AutenticacionService;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.LoginResponse;
import com.backend.dtos.RegisterRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/autenticacion")
public class AutenticacionController {

    @Autowired
    private AutenticacionService authServ;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegisterRequest request) {
        try {
            authServ.registroService(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new MessageResponse("Usuario registrado correctamente"));
        } catch (IllegalArgumentException e) {
            // Errores de validación del negocio
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error al registrar usuario"));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authServ.loginService(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error en el servidor"));
        }
    }

    // Clases auxiliares para respuestas
    static class MessageResponse {
        private String mensaje;
        public MessageResponse(String mensaje) {
            this.mensaje = mensaje;
        }
        public String getMensaje() {
            return mensaje;
        }
    }

    static class ErrorResponse {
        private String error;
        public ErrorResponse(String error) {
            this.error = error;
        }
        public String getError() {
            return error;
        }
    }
}