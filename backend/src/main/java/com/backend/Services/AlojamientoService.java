package com.backend.Services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.Entities.Alojamiento;
import com.backend.Entities.Ciudad;
import com.backend.Entities.Direccion;
import com.backend.Entities.Pais;
import com.backend.Entities.Reserva;
import com.backend.Entities.Usuario;
import com.backend.Repositories.IAlojamientoRepository;
import com.backend.Repositories.ICiudadRepository;
import com.backend.Repositories.IDireccionRepository;
import com.backend.Repositories.IPaisRepository;
import com.backend.Repositories.IReservaRepository;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.dtos.AlojamientoDTO;

import jakarta.transaction.Transactional;

@Service
public class AlojamientoService {
    @Autowired
    private IAlojamientoRepository alojamientoRepo;
    @Autowired
    private IReservaRepository reservaRepo;
    @Autowired
    private IUsuarioRepository usuarioRepo;
    @Autowired
    private IPaisRepository paisRepo; 
    @Autowired
    private ICiudadRepository ciudadRepo; 
    @Autowired
    private IDireccionRepository direccionRepo; 

    @Transactional
    public Alojamiento crearAlojamiento(AlojamientoDTO dto, Long id) {
        Usuario anfitrion = usuarioRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("usuario no registrado en el sistema"));
        Pais pais = dto.getDireccion().getCiudad().getPais();
        if (pais.getId() == null) {
            pais = paisRepo.save(pais);
        } else {
            pais = paisRepo.findById(pais.getId())
                .orElseThrow(() -> new RuntimeException("País no encontrado"));
        }
        
        Ciudad ciudad = dto.getDireccion().getCiudad();
        ciudad.setPais(pais);
        if (ciudad.getId() == null) {
            ciudad = ciudadRepo.save(ciudad);
        } else {
           
            ciudad = ciudadRepo.findById(ciudad.getId())
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada"));
        }
        Direccion direccion = dto.getDireccion();
        direccion.setCiudad(ciudad);
        if (direccion.getId() == null) {
            direccion = direccionRepo.save(direccion);
        } else {
    
            direccion = direccionRepo.findById(direccion.getId())
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
        }
        
    
        Alojamiento alojamiento = new Alojamiento();
        alojamiento.setNombre(dto.getNombre());
        alojamiento.setDescripcion(dto.getDescripcion());
        alojamiento.setImagen(dto.getImagen());
        alojamiento.setPrecioNoche(dto.getPrecioNoche());
        alojamiento.setCapacidadHuespedes(dto.getCapacidadHuespedes());
        alojamiento.setDireccion(direccion);
        alojamiento.setFechaCreacion(LocalDate.now());
        alojamiento.setFechaModificacion(LocalDate.now());
        alojamiento.setAnfitrion(anfitrion);

        return alojamientoRepo.save(alojamiento);
    }

    // TRAER ALOJAMIENTO
    // TODOS
    public List<Alojamiento> getAlojamientos() {
        return alojamientoRepo.findAll();
    }

    // Por ID
    public Alojamiento getAlojamientoById(Long id) {
        return alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));
    }

    // Por anfitrion
    public List<Alojamiento> getAlojamientosPorAnfitrion(Long anfitrionId) {
        return alojamientoRepo.findByAnfitrionId(anfitrionId);
    }

    // Por disponibilidad
    public List<Reserva> getAlojamientosPorDisponibilidad(Long alojamientoId) {
        return reservaRepo.findByAlojamientoId(alojamientoId);
    }

    // Con filtros
    public List<Alojamiento> buscarDisponibles(LocalDate checkin, LocalDate checkout,
                                               Integer capacidadMin, Double precioMax,
                                               Long ciudadId) {
        List<Alojamiento> disponibles;

        if (checkin != null && checkout != null) {
            disponibles = alojamientoRepo.findDisponiblesEnRango(checkin, checkout);
        } else {
            disponibles = alojamientoRepo.findAll();
        }

        if (capacidadMin != null) {
            disponibles.removeIf(a -> a.getCapacidadHuespedes() < capacidadMin);
        }

        if (precioMax != null) {
            disponibles.removeIf(a -> a.getPrecioNoche() > precioMax);
        }

        if (ciudadId != null) {
            disponibles.removeIf(a -> !a.getDireccion().getCiudad().getId().equals(ciudadId));
        }

        return disponibles;
    }

    @Transactional
    public Alojamiento actualizarAlojamiento(Long id, AlojamientoDTO dto) {
        Alojamiento alojamiento = alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        Pais pais = dto.getDireccion().getCiudad().getPais();
        if (pais.getId() == null) {
            pais = paisRepo.save(pais);
        } else {
            pais = paisRepo.findById(pais.getId())
                .orElseThrow(() -> new RuntimeException("País no encontrado"));
        }
        
        Ciudad ciudad = dto.getDireccion().getCiudad();
        ciudad.setPais(pais);
        if (ciudad.getId() == null) {
            ciudad = ciudadRepo.save(ciudad);
        } else {
            ciudad = ciudadRepo.findById(ciudad.getId())
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada"));
        }
        
        Direccion direccion = dto.getDireccion();
        direccion.setCiudad(ciudad);
        if (direccion.getId() == null) {
            direccion = direccionRepo.save(direccion);
        } else {
            direccion = direccionRepo.findById(direccion.getId())
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
        }

        alojamiento.setNombre(dto.getNombre());
        alojamiento.setDescripcion(dto.getDescripcion());
        alojamiento.setImagen(dto.getImagen());
        alojamiento.setPrecioNoche(dto.getPrecioNoche());
        alojamiento.setCapacidadHuespedes(dto.getCapacidadHuespedes());
        alojamiento.setDireccion(direccion);
        alojamiento.setFechaModificacion(LocalDate.now());

        return alojamientoRepo.save(alojamiento);
    }

    @Transactional
    public void eliminarAlojamiento(Long id) {
        Alojamiento alojamiento = alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        List<Reserva> reservasFuturas = reservaRepo.findReservasFuturas(id, LocalDate.now());
        if (!reservasFuturas.isEmpty()) {
            throw new RuntimeException("No se puede eliminar: tiene reservas futuras activas");
        }

        alojamientoRepo.delete(alojamiento);
    }
}