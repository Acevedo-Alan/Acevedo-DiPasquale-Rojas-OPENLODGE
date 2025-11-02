package com.backend.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.Entities.Pais;
import com.backend.Repositories.IPaisRepository;

@Service
public class PaisService {

    @Autowired
    private IPaisRepository paisRepo;

    @Transactional
    public Pais crearOBuscar(String nombre) {
        return paisRepo.findByNombre(nombre)
            .orElseGet(() -> {
                Pais nuevoPais = new Pais();
                nuevoPais.setNombre(nombre);
                return paisRepo.save(nuevoPais);
            });
    }

    public Pais buscarPorNombre(String nombre) {
        return paisRepo.findByNombre(nombre)
            .orElseThrow(() -> new RuntimeException("País no encontrado: " + nombre));
    }

    public List<Pais> obtenerTodos() {
        return paisRepo.findAll();
    }

    public Pais obtenerPorId(Long id) {
        return paisRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("País no encontrado con ID: " + id));
    }
}