package com.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.Services.AutenticacionService;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.LoginResponse;
import com.backend.dtos.RegisterRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/autenticacion")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true")
public class AutenticationController {

    @Autowired
    private AutenticacionService autenticacionService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(autenticacionService.login(request));
    }
    @PostMapping("/registro")
    public ResponseEntity<LoginResponse> registro(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(autenticacionService.registro(request));
    }
}