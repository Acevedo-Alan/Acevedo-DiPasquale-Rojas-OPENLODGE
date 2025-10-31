package com.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.backend.Entities.Usuario;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.Security.JwtUtil;
import com.backend.enums.Roles;

import jakarta.transaction.Transactional;

@Service
public class UsuarioService {
    @Autowired
    private IUsuarioRepository usuarioRepo;
    @Autowired
    private JwtUtil jwtUtil;

    //Cambiar rol
    @Transactional
    public Usuario cambiarRol(Long id, Roles nuevoRol, String token) {
        String rol = jwtUtil.getRolFromToken(token);
        if (!"ADMINISTRADOR".equalsIgnoreCase(rol)) {
            throw new AccessDeniedException("No te puedo decir por que no poides hacer lo que queres hacer vos ya sabes");
        }

        Usuario usuario = usuarioRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (nuevoRol != Roles.ANFITRION 
                && nuevoRol != Roles.HUESPED 
                && nuevoRol != Roles.ADMINISTRADOR) {
            throw new IllegalArgumentException("Rol inválido");
        }
        usuario.setRol(nuevoRol);
        return usuarioRepo.save(usuario);
    }

    // Obtener usuario por ID
    public Usuario obtenerPorId(Long id) {
        return usuarioRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Obtener usuario por username
    public Usuario obtenerPorUsername(String username) {
        return usuarioRepo.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
