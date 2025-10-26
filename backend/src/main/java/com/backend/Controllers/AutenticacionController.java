package com.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.Services.AutenticacionService;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.LoginResponse;
import com.backend.dtos.RegisterRequest;

@RestController
@RequestMapping("/autenticacion")
public class AutenticacionController {

    @Autowired
    private AutenticacionService authServ;

    @PostMapping("/registro")
    public ResponseEntity<String> registro(@RequestBody RegisterRequest request){
        try{
            authServ.registroService(request);
            return ResponseEntity.ok("Usuario registrado correctamente");
        }catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar usuario");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
        LoginResponse response = authServ.loginService(request);
        return ResponseEntity.ok(response);
    }
}