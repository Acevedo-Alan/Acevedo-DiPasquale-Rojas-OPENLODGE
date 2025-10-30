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

    // Registro (RF01, RF05)
    @Transactional
    public void registroService(RegisterRequest request) {
        // Validar que el username no exista
        if (repository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        // Validar que el email no exista
        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("El correo electrónico ya está registrado");
        }

        // Validar formato de contraseña (RNF03)
        validarFormatoPassword(request.getPassword());

        // Crear el usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setEmail(request.getEmail());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setFechaCreacion(LocalDate.now()); 
        usuario.setRol(Roles.HUESPED); // Por defecto es huésped
        
        repository.save(usuario);

        // TODO: Enviar correo de confirmación (RF05)
        // emailService.enviarCorreoConfirmacion(usuario.getEmail());
    }

    // Login (RF02)
    public LoginResponse loginService(LoginRequest request) {
        // Buscar usuario por username
        Usuario usuario = repository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Usuario o contraseña inválidos"));

        // Verificar contraseña
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Usuario o contraseña inválidos");
        }

        // Generar token JWT
        String token = jwtUtil.generarToken(usuario.getUsername(), usuario.getRol().name());
        
        return new LoginResponse(
            token, 
            usuario.getUsername(), 
            usuario.getNombre(), 
            usuario.getRol().name()
        );
    }

    // Validar formato de contraseña según RNF03
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