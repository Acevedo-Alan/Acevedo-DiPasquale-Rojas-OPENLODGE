package com.backend.Services;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.backend.Entities.*;
import com.backend.Repositories.*;
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
    @Autowired
    private IServicioRepository servicioRepo;

    @Transactional
    public Alojamiento crearAlojamiento(AlojamientoDTO dto, Long anfitrionId) {
        Usuario anfitrion = usuarioRepo.findById(anfitrionId)
            .orElseThrow(() -> new RuntimeException("Usuario no registrado"));
        
        Direccion direccion = procesarDireccion(dto.getDireccion());
        
        Set<Servicio> servicios = procesarServicios(dto.getServicios());
    
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
        alojamiento.setServicios(servicios);

        return alojamientoRepo.save(alojamiento);
    }

    @Transactional
    public Alojamiento actualizarAlojamiento(Long id, AlojamientoDTO dto, Long anfitrionId) {
        Alojamiento alojamiento = alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        if (!alojamiento.getAnfitrion().getId().equals(anfitrionId)) {
            throw new RuntimeException("No tienes permiso para modificar este alojamiento");
        }

        Direccion direccion = procesarDireccion(dto.getDireccion());
        Set<Servicio> servicios = procesarServicios(dto.getServicios());

        alojamiento.setNombre(dto.getNombre());
        alojamiento.setDescripcion(dto.getDescripcion());
        alojamiento.setImagen(dto.getImagen());
        alojamiento.setPrecioNoche(dto.getPrecioNoche());
        alojamiento.setCapacidadHuespedes(dto.getCapacidadHuespedes());
        alojamiento.setDireccion(direccion);
        alojamiento.setFechaModificacion(LocalDate.now());
        alojamiento.setServicios(servicios);

        return alojamientoRepo.save(alojamiento);
    }

    @Transactional
    public void eliminarAlojamiento(Long id, Long anfitrionId) {
        Alojamiento alojamiento = alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        if (!alojamiento.getAnfitrion().getId().equals(anfitrionId)) {
            throw new RuntimeException("No tienes permiso para eliminar este alojamiento");
        }

        List<Reserva> reservasFuturas = reservaRepo.findReservasFuturas(id, LocalDate.now());
        if (!reservasFuturas.isEmpty()) {
            throw new RuntimeException("No se puede eliminar: tiene " + reservasFuturas.size() + " reservas futuras");
        }

        alojamientoRepo.delete(alojamiento);
    }

    private Direccion procesarDireccion(Direccion direccionDTO) {
        Pais pais = direccionDTO.getCiudad().getPais();
        if (pais.getId() == null) {
            pais = paisRepo.save(pais);
        } else {
            pais = paisRepo.findById(pais.getId())
                .orElseThrow(() -> new RuntimeException("País no encontrado"));
        }
        
        Ciudad ciudad = direccionDTO.getCiudad();
        ciudad.setPais(pais);
        if (ciudad.getId() == null) {
            ciudad = ciudadRepo.save(ciudad);
        } else {
            ciudad = ciudadRepo.findById(ciudad.getId())
                .orElseThrow(() -> new RuntimeException("Ciudad no encontrada"));
        }
        
        Direccion direccion = new Direccion();
        direccion.setId(direccionDTO.getId());
        direccion.setCalle(direccionDTO.getCalle());
        direccion.setNumero(direccionDTO.getNumero());
        direccion.setDepto(direccionDTO.getDepto());
        direccion.setPiso(direccionDTO.getPiso());
        direccion.setCiudad(ciudad);
        
        if (direccion.getId() == null) {
            direccion = direccionRepo.save(direccion);
        } else {
            direccion = direccionRepo.findById(direccion.getId())
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
        }
        
        return direccion;
    }

    private Set<Servicio> procesarServicios(Set<Servicio> serviciosDTO) {
        if (serviciosDTO == null || serviciosDTO.isEmpty()) {
            return new HashSet<>();
        }
        
        return serviciosDTO.stream()
            .map(servicio -> {
                if (servicio.getId() != null) {
                    return servicioRepo.findById(servicio.getId())
                        .orElseThrow(() -> new RuntimeException("Servicio ID " + servicio.getId() + " no encontrado"));
                } else {
                    return servicioRepo.findByNombre(servicio.getNombre())
                        .orElseGet(() -> servicioRepo.save(servicio));
                }
            })
            .collect(Collectors.toSet());
    }

    public List<Alojamiento> getAlojamientos() {
        return alojamientoRepo.findAll();
    }

    public Alojamiento getAlojamientoById(Long id) {
        return alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));
    }

    public List<Alojamiento> getAlojamientosPorAnfitrion(Long anfitrionId) {
        return alojamientoRepo.findByAnfitrionId(anfitrionId);
    }

    public List<Reserva> getAlojamientosPorDisponibilidad(Long alojamientoId) {
        return reservaRepo.findByAlojamientoId(alojamientoId);
    }

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
}