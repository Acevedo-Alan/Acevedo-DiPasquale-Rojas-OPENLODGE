package com.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.Entities.Servicio;
import com.backend.Repositories.IServicioRepository;
import com.backend.dtos.ServicioDTO;

@Service
public class ServicioService {

    @Autowired
    private IServicioRepository servicioRepository;

    public List<Servicio> obtenerTodosLosServicios() {
        return servicioRepository.findAll();
    }

    public Servicio obtenerServicioPorId(Long id) {
        return servicioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado con ID: " + id));
    }

    public Servicio crearServicio(ServicioDTO dto) {
        // Verificar si ya existe un servicio con ese nombre
        if (servicioRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new RuntimeException("Ya existe un servicio con el nombre: " + dto.getNombre());
        }

        Servicio servicio = new Servicio();
        servicio.setNombre(dto.getNombre());
        
        return servicioRepository.save(servicio);
    }

    public Servicio actualizarServicio(Long id, ServicioDTO dto) {
        Servicio servicio = obtenerServicioPorId(id);
        
        // Verificar si el nuevo nombre ya existe en otro servicio
        servicioRepository.findByNombre(dto.getNombre())
            .ifPresent(s -> {
                if (!s.getId().equals(id)) {
                    throw new RuntimeException("Ya existe un servicio con el nombre: " + dto.getNombre());
                }
            });
        
        servicio.setNombre(dto.getNombre());
        return servicioRepository.save(servicio);
    }

    public void eliminarServicio(Long id) {
        Servicio servicio = obtenerServicioPorId(id);
        servicioRepository.delete(servicio);
    }
}