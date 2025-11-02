package com.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.Entities.Ciudad;
import com.backend.Entities.Pais;
import com.backend.Repositories.ICiudadRepository;
import com.backend.Repositories.IPaisRepository;

@Service
public class CiudadService {

    @Autowired
    private ICiudadRepository ciudadRepo;

    @Autowired
    private IPaisRepository paisRepo;

    @Transactional
    public Ciudad crearOBuscar(String nombre, Long paisId) {
        Pais pais = paisRepo.findById(paisId)
            .orElseThrow(() -> new RuntimeException("País no encontrado"));

        return ciudadRepo.findByNombreAndPaisId(nombre, paisId)
            .orElseGet(() -> {
                Ciudad nuevaCiudad = new Ciudad();
                nuevaCiudad.setNombre(nombre);
                nuevaCiudad.setPais(pais);
                return ciudadRepo.save(nuevaCiudad);
            });
    }

    public Ciudad buscarPorNombreYPais(String nombre, Long paisId) {
        return ciudadRepo.findByNombreAndPaisId(nombre, paisId)
            .orElseThrow(() -> new RuntimeException(
                "Ciudad no encontrada: " + nombre + " en país ID: " + paisId));
    }

    public List<Ciudad> obtenerTodas() {
        return ciudadRepo.findAll();
    }

    public Ciudad obtenerPorId(Long id) {
        return ciudadRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Ciudad no encontrada con ID: " + id));
    }

    public List<Ciudad> obtenerPorPais(Long paisId) {
        return ciudadRepo.findByPaisId(paisId);
    }
}