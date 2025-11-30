package com.backend.Services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.Entities.*;
import com.backend.Repositories.*;
import com.backend.dtos.FechasOcupadasDTO;
import com.backend.dtos.ReservaDTO;

@Service
public class ReservaService {

    @Autowired
    private IReservaRepository reservaRepo;
    
    @Autowired
    private IUsuarioRepository usuarioRepo;
    
    @Autowired
    private IAlojamientoRepository alojamientoRepo;

    @Transactional
    public Reserva crearReserva(ReservaDTO dto, Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Alojamiento alojamiento = alojamientoRepo.findById(dto.getAlojamientoId())
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        if (alojamiento.getAnfitrion().getId().equals(usuarioId)) {
            throw new RuntimeException("No puedes reservar tu propio alojamiento");
        }

        ReservaId reservaId = new ReservaId(usuarioId, dto.getAlojamientoId());
        if (reservaRepo.existsById(reservaId)) {
            throw new RuntimeException("Ya tienes una reserva activa para este alojamiento");
        }

        validarFechas(dto.getCheckin(), dto.getCheckout());
        validarCapacidad(dto.getHuespedes(), alojamiento.getCapacidadHuespedes());
        validarDisponibilidad(dto.getAlojamientoId(), dto.getCheckin(), dto.getCheckout());

        long noches = ChronoUnit.DAYS.between(dto.getCheckin(), dto.getCheckout());
        if (noches < 1) {
            throw new RuntimeException("La reserva debe ser de al menos 1 noche");
        }
        
        Double importe = noches * alojamiento.getPrecioNoche();

        Reserva reserva = new Reserva();
        reserva.setId(reservaId);
        reserva.setUsuario(usuario);
        reserva.setAlojamiento(alojamiento);
        reserva.setCheckin(dto.getCheckin());
        reserva.setCheckout(dto.getCheckout());
        reserva.setHuespedes(dto.getHuespedes());
        reserva.setImporte(importe);
        reserva.setFechaCreacion(LocalDate.now());
        reserva.setFechaModificacion(LocalDate.now());

        return reservaRepo.save(reserva);
    }

    @Transactional
    public Reserva modificarReserva(Long usuarioId, Long alojamientoId, 
                                    LocalDate nuevoCheckin, LocalDate nuevoCheckout,
                                    Integer nuevosHuespedes) {
        
        ReservaId id = new ReservaId(usuarioId, alojamientoId);
        Reserva reserva = reservaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (!reserva.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tienes permiso para modificar esta reserva");
        }

        validarAnticipacionModificacion(reserva.getFechaCreacion());

        validarFechas(nuevoCheckin, nuevoCheckout);
        validarCapacidad(nuevosHuespedes, reserva.getAlojamiento().getCapacidadHuespedes());

        List<Reserva> conflictos = reservaRepo.findReservasEnRango(
            alojamientoId, nuevoCheckin, nuevoCheckout
        );
        conflictos.removeIf(r -> r.getId().equals(id));

        if (!conflictos.isEmpty()) {
            throw new RuntimeException("Las nuevas fechas no están disponibles");
        }

        reserva.setCheckin(nuevoCheckin);
        reserva.setCheckout(nuevoCheckout);
        reserva.setHuespedes(nuevosHuespedes);
        reserva.setFechaModificacion(LocalDate.now());

        long noches = ChronoUnit.DAYS.between(nuevoCheckin, nuevoCheckout);
        reserva.setImporte(noches * reserva.getAlojamiento().getPrecioNoche());

        return reservaRepo.save(reserva);
    }

    @Transactional
    public void cancelarReserva(Long usuarioId, Long alojamientoId) {
        ReservaId id = new ReservaId(usuarioId, alojamientoId);
        Reserva reserva = reservaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        if (!reserva.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("No tienes permiso para cancelar esta reserva");
        }
        validarAnticipacionModificacion(reserva.getFechaCreacion());
        reservaRepo.delete(reserva);
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerHistorialUsuario(Long usuarioId) {
        List<Reserva> reservas = reservaRepo.findByUsuarioId(usuarioId);
        
        reservas.forEach(r -> {
            r.getAlojamiento().getNombre();
            r.getUsuario().getNombre();
        });
        
        return reservas;
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerHistorialAlojamiento(Long alojamientoId, Long anfitrionId) {
        Alojamiento alojamiento = alojamientoRepo.findById(alojamientoId)
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));
        
        if (!alojamiento.getAnfitrion().getId().equals(anfitrionId)) {
            throw new RuntimeException("No tienes permiso para ver las reservas de este alojamiento");
        }
        
        List<Reserva> reservas = reservaRepo.findByAlojamientoId(alojamientoId);
        
        reservas.forEach(r -> {
            r.getAlojamiento().getNombre();
            r.getUsuario().getNombre();
        });
        
        return reservas;
    }

    // Método público para obtener solo las fechas ocupadas (sin datos del huésped)
    @Transactional(readOnly = true)
    public List<FechasOcupadasDTO> obtenerFechasOcupadas(Long alojamientoId) {
        if (!alojamientoRepo.existsById(alojamientoId)) {
            throw new RuntimeException("Alojamiento no encontrado");
        }
        
        List<Reserva> reservas = reservaRepo.findByAlojamientoId(alojamientoId);
        
        return reservas.stream()
            .map(r -> new FechasOcupadasDTO(r.getCheckin(), r.getCheckout()))
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerReservasPasadas(Long usuarioId) {
        List<Reserva> reservas = reservaRepo.findReservasPasadas(usuarioId, LocalDate.now());
        
        reservas.forEach(r -> {
            r.getAlojamiento().getNombre();
            r.getUsuario().getNombre();
        });
        
        return reservas;
    }

    @Transactional(readOnly = true)
    public boolean verificarDisponibilidad(Long alojamientoId, LocalDate checkin, LocalDate checkout) {
        if (!alojamientoRepo.existsById(alojamientoId)) {
            throw new RuntimeException("Alojamiento no encontrado");
        }
        
        validarFechas(checkin, checkout);
        
        List<Reserva> conflictos = reservaRepo.findReservasEnRango(alojamientoId, checkin, checkout);
        return conflictos.isEmpty();
    }

    private void validarFechas(LocalDate checkin, LocalDate checkout) {
        if (checkin.isBefore(LocalDate.now())) {
            throw new RuntimeException("La fecha de check-in no puede ser en el pasado");
        }
        if (checkout.isBefore(checkin) || checkout.isEqual(checkin)) {
            throw new RuntimeException("La fecha de check-out debe ser posterior al check-in");
        }
    }

    private void validarCapacidad(Integer huespedes, Integer capacidadMaxima) {
        if (huespedes > capacidadMaxima) {
            throw new RuntimeException("Excede la capacidad del alojamiento (" + capacidadMaxima + " personas)");
        }
        if (huespedes < 1) {
            throw new RuntimeException("Debe haber al menos 1 huésped");
        }
    }

    private void validarDisponibilidad(Long alojamientoId, LocalDate checkin, LocalDate checkout) {
        List<Reserva> conflictos = reservaRepo.findReservasEnRango(alojamientoId, checkin, checkout);
        if (!conflictos.isEmpty()) {
            throw new RuntimeException("El alojamiento no está disponible en esas fechas");
        }
    }

    private void validarAnticipacionModificacion(LocalDate fechaCreacion) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime fechaCreacionDateTime = fechaCreacion.atStartOfDay();
        long horasDesdeCreacion = ChronoUnit.HOURS.between(fechaCreacionDateTime, ahora);
        
        if (horasDesdeCreacion > 48) {
            throw new RuntimeException("El plazo de 48 horas para modificar o cancelar la reserva ha expirado");
        }
    }
}