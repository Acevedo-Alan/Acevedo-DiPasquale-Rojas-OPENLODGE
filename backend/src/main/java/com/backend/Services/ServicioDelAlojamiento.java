package com.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.Entities.Servicio;
import com.backend.Repositories.IServicioRepository;

@Service
public class ServicioDelAlojamiento {

    @Autowired
    private IServicioRepository servicioRepo;

    //Crear servicio
    @Transactional
    public Servicio crearServicio(String nombre) {
        if (servicioRepo.existsByNombre(nombre)) {
            throw new RuntimeException("El servicio ya existe");
        }

        Servicio servicio = new Servicio();
        servicio.setNombre(nombre);
        return servicioRepo.save(servicio);
    }

    //Modificar servicio
    @Transactional
    public Servicio modificarServicio(Long id, String nuevoNombre) {
        Servicio servicio = servicioRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
        if (!servicio.getNombre().equals(nuevoNombre) && 
            servicioRepo.existsByNombre(nuevoNombre)) {
            throw new RuntimeException("Ya existe un servicio con ese nombre");
        }

        servicio.setNombre(nuevoNombre);
        return servicioRepo.save(servicio);
    }

    //Eliminar servicio
    @Transactional
    public void eliminarServicio(Long id) {
        Servicio servicio = servicioRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        servicioRepo.delete(servicio);
    }

    //Obtener todos los servicios
    public List<Servicio> obtenerTodos() {
        return servicioRepo.findAll();
    }

    //Obtener por ID
    public Servicio obtenerPorId(Long id) {
        return servicioRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }

    //Obtener por nombre
    public Servicio obtenerPorNombre(String nombre){
        return servicioRepo.findByNombre(nombre)
            .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
    }
}