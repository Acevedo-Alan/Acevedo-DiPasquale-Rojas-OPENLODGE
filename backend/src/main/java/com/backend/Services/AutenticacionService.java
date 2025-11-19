package com.backend.Services;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.Security.JwtUtil;
import com.backend.dtos.LoginRequest;
import com.backend.dtos.LoginResponse;
import com.backend.dtos.RegisterRequest;
import com.backend.enums.Roles;
import jakarta.validation.Valid;

@Service
public class AutenticacionService {
    @Autowired
    private IUsuarioRepository usuarioRepository;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        authManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()
            )
        );
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado")
        );
        String token = jwtUtil.generateToken(usuario);
        return LoginResponse.builder().rol(usuario.getRol().name()).token(token).build();
    }

    public LoginResponse registro(@Valid RegisterRequest request) {
       if (usuarioRepository.findByUsername(request.getUsername())
                            .isPresent()) throw new RuntimeException("Ya existe");
        Usuario usuario = Usuario.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .telefono(request.getTelefono())
                .dni(request.getDni())
                .fechaNacimiento(request.getFechaNacimiento())
                .fechaCreacion(LocalDate.now())
                .rol(Roles.HUESPED)
                .build();
        usuarioRepository.save(usuario);

        String token = jwtUtil.generateToken(usuario);
        return LoginResponse.builder().rol(usuario.getRol().name()).token(token).build();
    }
}
