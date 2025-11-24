package com.backend.Services;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.Entities.*;
import com.backend.Repositories.*;
import com.backend.dtos.AlojamientoDTO;
import com.backend.enums.Roles;

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


    @Transactional(readOnly = true)
    public List<Alojamiento> getAlojamientos() {
        List<Alojamiento> alojamientos = alojamientoRepo.findAll();
        

        alojamientos.forEach(a -> {
            a.getAnfitrion().getNombre();
            a.getDireccion().getCiudad().getPais(); 
            a.getServicios().size();
        });
        
        return alojamientos;
    }

    @Transactional(readOnly = true)
    public Alojamiento getAlojamientoById(Long id) {
        Alojamiento alojamiento = alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));
        
        // Forzar carga de relaciones LAZY
        alojamiento.getAnfitrion().getNombre();
        alojamiento.getDireccion().getCiudad().getPais();
        alojamiento.getServicios().size();
        
        return alojamiento;
    }
    
    @Transactional(readOnly = true)
    public List<Alojamiento> getAlojamientosPorAnfitrion(Long anfitrionId) {
        List<Alojamiento> alojamientos = alojamientoRepo.findByAnfitrionId(anfitrionId);
        
        alojamientos.forEach(a -> {
            a.getAnfitrion().getNombre();
            a.getDireccion().getCiudad().getPais();
            a.getServicios().size();
        });
        
        return alojamientos;
    }

    @Transactional(readOnly = true)
    public List<Reserva> getAlojamientosPorDisponibilidad(Long alojamientoId) {
        return reservaRepo.findByAlojamientoId(alojamientoId);
    }

    @Transactional(readOnly = true)
    public List<Alojamiento> buscarDisponibles(LocalDate checkin, LocalDate checkout,
                                               Integer capacidadMin, Double precioMax,
                                               Long ciudadId) {
        List<Alojamiento> disponibles;

        if (checkin != null && checkout != null) {
            disponibles = alojamientoRepo.findDisponiblesEnRango(checkin, checkout);
        } else {
            disponibles = alojamientoRepo.findAll();
        }

        disponibles.forEach(a -> {
            a.getAnfitrion().getNombre();
            a.getDireccion().getCiudad().getPais();
            a.getServicios().size();
        });


        if (capacidadMin != null) {
            disponibles = disponibles.stream()
                .filter(a -> a.getCapacidadHuespedes() >= capacidadMin)
                .collect(Collectors.toList());
        }

        if (precioMax != null) {
            disponibles = disponibles.stream()
                .filter(a -> a.getPrecioNoche() <= precioMax)
                .collect(Collectors.toList());
        }

        if (ciudadId != null) {
            disponibles = disponibles.stream()
                .filter(a -> a.getDireccion().getCiudad().getId().equals(ciudadId))
                .collect(Collectors.toList());
        }

        return disponibles;
    }
    @Transactional
    public Alojamiento crearAlojamiento(AlojamientoDTO dto, Long anfitrionId) {
        Usuario anfitrion = usuarioRepo.findById(anfitrionId)
            .orElseThrow(() -> new RuntimeException("Usuario no registrado"));
        
        if (anfitrion.getRol() != Roles.ANFITRION) {
            throw new RuntimeException("El usuario no tiene rol de anfitrión");
        }
        
        Direccion direccion = procesarDireccionDesdeDTO(dto);
        

        Set<Servicio> servicios = procesarServiciosById(dto.getServiciosId());
    
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

        Direccion direccion = procesarDireccionDesdeDTO(dto);
        
        Set<Servicio> servicios = procesarServiciosById(dto.getServiciosId());

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

    private Direccion procesarDireccionDesdeDTO(AlojamientoDTO dto) {
        // Buscar o crear país
        Pais pais = paisRepo.findByNombre(dto.getPais())
            .orElseGet(() -> {
                Pais nuevoPais = new Pais();
                nuevoPais.setNombre(dto.getPais());
                return paisRepo.save(nuevoPais);
            });

        // Buscar o crear ciudad
        Ciudad ciudad = ciudadRepo.findByNombreAndPais(dto.getCiudad(), pais)
            .orElseGet(() -> {
                Ciudad nuevaCiudad = new Ciudad();
                nuevaCiudad.setNombre(dto.getCiudad());
                nuevaCiudad.setPais(pais);
                return ciudadRepo.save(nuevaCiudad);
            });

        // Crear o actualizar dirección
        Direccion direccion = new Direccion();
        direccion.setCalle(dto.getCalle());
        direccion.setNumero(dto.getNumero());
        direccion.setDepto(dto.getDepto());
        direccion.setPiso(dto.getPiso());
        direccion.setCiudad(ciudad);

        return direccionRepo.save(direccion);
    }

    private Set<Servicio> procesarServiciosById(Set<Long> serviciosId) {
        if (serviciosId == null || serviciosId.isEmpty()) {
            return new HashSet<>();
        }

        return serviciosId.stream()
            .map(id -> servicioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                    "Servicio no encontrado con ID: " + id)))
            .collect(Collectors.toSet());
    }
}