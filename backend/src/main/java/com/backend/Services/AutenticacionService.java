package com.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.Security.JwtUtil;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.LoginResponse;
import com.backend.dtos.RegisterRequest;

@Service
public class AutenticacionService {

    @Autowired
    private IUsuarioRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil tokenUtilidades;

    //REgistro
    public void registroService(RegisterRequest request){
        if (!repository.existsByUsername(request.getUsername())) {
            String hashedPassword = passwordEncoder.encode(request.getPassword());
            Usuario usuario = new Usuario();
            usuario.setUsername(request.getUsername());
            usuario.setPassword(hashedPassword);
            repository.save(usuario);
        }else{
            throw new RuntimeException("El usuario ya fue registrado");
        }
    }


    //Login
    public LoginResponse loginService(LoginRequest request){
        Usuario usuario = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Usuario o contraseña invalidos");
        }
        String token = tokenUtilidades.generarToken(usuario.getUsername());
        return new LoginResponse(token);
    }
}