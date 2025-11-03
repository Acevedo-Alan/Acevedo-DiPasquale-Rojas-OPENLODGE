package com.backend.Services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.Entities.Alojamiento;
import com.backend.Entities.Reserva;
import com.backend.Entities.Usuario;
import com.backend.Repositories.IAlojamientoRepository;
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

    @Transactional
    public Alojamiento crearAlojamiento(AlojamientoDTO dto){                      
        Alojamiento alojamiento = new Alojamiento();
        alojamiento.setNombre(dto.getNombre());
        alojamiento.setDescripcion(dto.getDescripcion());
        alojamiento.setImagen(dto.getImagen());
        alojamiento.setPrecioNoche(dto.getPrecioNoche());
        alojamiento.setCapacidadHuespedes(dto.getCapacidadHuespedes());
        alojamiento.setDireccion(dto.getDireccion());
        alojamiento.setServicios(dto.getServicios());
        alojamiento.setFechaCreacion(LocalDate.now());
        alojamiento.setFechaModificacion(LocalDate.now());
        
        // Usar el primer usuario disponible como anfitrión temporal
        Usuario anfitrion = usuarioRepo.findAll().stream().findFirst()
            .orElseThrow(() -> new RuntimeException("No hay usuarios registrados en el sistema"));
        alojamiento.setAnfitrion(anfitrion);

        return alojamientoRepo.save(alojamiento);
    }

    //TRAER ALOJAMIENTO
    //TODOS
    public List<Alojamiento> getAlojamientos(){
        return alojamientoRepo.findAll();
    }

    //Por ID
    public Alojamiento getAlojamientoById(Long id){
        return alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));
    }

    //Por anfitrion
    public List<Alojamiento> getAlojamientosPorAnfitrion(Long anfitrionId){
        return alojamientoRepo.findByAnfitrionId(anfitrionId);
    }

    //Por disponibilidad

    public List<Reserva> getAlojamientosPorDisponibilidad(Long alojamientoId){
        return reservaRepo.findByAlojamientoId(alojamientoId);
    }

    //Con filtros
    public List<Alojamiento> buscarDisponibles(LocalDate checkin, LocalDate checkout,
                                               Integer capacidadMin, Double precioMax,
                                               Long ciudadId) {
        List<Alojamiento> disponibles;

        if (checkin != null && checkout != null) {
            // Buscar por rango de fechas
            disponibles = alojamientoRepo.findDisponiblesEnRango(checkin, checkout);
        } else {
            // Sin filtro de fechas
            disponibles = alojamientoRepo.findAll();
        }

        // Filtrar por capacidad
        if (capacidadMin != null) {
            disponibles.removeIf(a -> a.getCapacidadHuespedes() < capacidadMin);
        }

        // Filtrar por precio
        if (precioMax != null) {
            disponibles.removeIf(a -> a.getPrecioNoche() > precioMax);
        }

        // Filtrar por ciudad
        if (ciudadId != null) {
            disponibles.removeIf(a -> !a.getDireccion().getCiudad().getId().equals(ciudadId));
        }

        return disponibles;
    }


    public Alojamiento actualizarAlojamiento(Long id, AlojamientoDTO dto){
        Alojamiento alojamiento = alojamientoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        alojamiento.setNombre(dto.getNombre());
        alojamiento.setDescripcion(dto.getDescripcion());
        alojamiento.setImagen(dto.getImagen());
        alojamiento.setPrecioNoche(dto.getPrecioNoche());
        alojamiento.setCapacidadHuespedes(dto.getCapacidadHuespedes());
        alojamiento.setDireccion(dto.getDireccion());
        alojamiento.setServicios(dto.getServicios());
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
