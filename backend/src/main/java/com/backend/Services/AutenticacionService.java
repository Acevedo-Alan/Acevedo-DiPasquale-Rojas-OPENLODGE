package com.backend.Services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.Security.JwtUtil;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.LoginResponse;
import com.backend.dtos.RegisterRequest;
import com.backend.enums.Roles;

@Service
public class AutenticacionService {

    @Autowired
    private IUsuarioRepository repository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Transactional
    public void registroService(RegisterRequest request) {
        if (repository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado");
        }
        validarFormatoPassword(request.getPassword());

        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setEmail(request.getEmail());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setFechaCreacion(LocalDate.now()); 
        usuario.setRol(Roles.HUESPED);
        
        repository.save(usuario);
    }

    public LoginResponse loginService(LoginRequest request) {
        Usuario usuario = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña inválidos"));
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Usuario o contraseña inválidos");
        }

        String token = jwtUtil.generarToken(usuario.getUsername(), usuario.getRol().name());
        
        return new LoginResponse(
            token, 
            usuario.getUsername(), 
            usuario.getNombre(), 
            usuario.getRol().name()
        );
    }

    //Validacion auxiliar para la contraseña
    private void validarFormatoPassword(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException(
                "La contraseña debe tener al menos 8 caracteres"
            );
        }

        boolean tieneMayuscula = password.chars().anyMatch(Character::isUpperCase);
        boolean tieneMinuscula = password.chars().anyMatch(Character::isLowerCase);
        boolean tieneNumero = password.chars().anyMatch(Character::isDigit);
        boolean tieneEspecial = password.chars()
            .anyMatch(c -> "!@#$%^&*()_+-=[]{}|;:,.<>?".indexOf(c) >= 0);

        if (!tieneMayuscula || !tieneMinuscula || !tieneNumero || !tieneEspecial) {
            throw new IllegalArgumentException(
                "La contraseña debe contener al menos: una mayúscula, " +
                "una minúscula, un número y un carácter especial"
            );
        }
    }
}