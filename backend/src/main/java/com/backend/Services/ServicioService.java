package com.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.Entities.Servicio;
import com.backend.Repositories.IServicioRepository;
import com.backend.dtos.ServicioDTO;

@Service
public class ServicioService {

    @Autowired
    private IServicioRepository servicioRepository;

    @Transactional(readOnly = true)
    public List<Servicio> obtenerTodosLosServicios() {
        return servicioRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }


    @Transactional
    public Servicio crearServicio(ServicioDTO dto) {
        String nombreNormalizado = normalizarNombre(dto.getNombre());
        if (servicioRepository.findByNombre(nombreNormalizado).isPresent()) {
            throw new RuntimeException("Ya existe un servicio con el nombre: " + nombreNormalizado);
        }

        Servicio servicio = new Servicio();
        servicio.setNombre(nombreNormalizado);
        
        return servicioRepository.save(servicio);
    }

    @Transactional
    public Servicio actualizarServicio(Long id, ServicioDTO dto) {
        Servicio servicio = obtenerServicioPorId(id);
        String nombreNormalizado = normalizarNombre(dto.getNombre());
    
        servicioRepository.findByNombre(nombreNormalizado)
            .ifPresent(s -> {
                if (!s.getId().equals(id)) {
                    throw new RuntimeException("Ya existe un servicio con el nombre: " + nombreNormalizado);
                }
            });
        
        servicio.setNombre(nombreNormalizado);
        return servicioRepository.save(servicio);
    }

    @Transactional
    public void eliminarServicio(Long id) {
        Servicio servicio = obtenerServicioPorId(id);
        
        if (servicio.getAlojamientos() != null && !servicio.getAlojamientos().isEmpty()) {
            throw new RuntimeException(
                "No se puede eliminar el servicio porque está siendo usado por " 
                + servicio.getAlojamientos().size() + " alojamiento(s)"
            );
        }
        
        servicioRepository.delete(servicio);
    }

    private String normalizarNombre(String nombre) {
        if (nombre == null || nombre.trim().isEmpty()) {
            throw new RuntimeException("El nombre del servicio no puede estar vacío");
        }
        
        String normalizado = nombre.trim();
        if (normalizado.length() > 0) {
            normalizado = normalizado.substring(0, 1).toUpperCase() 
                        + normalizado.substring(1).toLowerCase();
        }
        
        return normalizado;
    }
}