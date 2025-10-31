package com.backend.Services;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.Entities.Alojamiento;
import com.backend.Entities.Reserva;
import com.backend.Entities.ReservaId;
import com.backend.Entities.Usuario;
import com.backend.Repositories.IAlojamientoRepository;
import com.backend.Repositories.IReservaRepository;
import com.backend.Repositories.IUsuarioRepository;
import com.backend.dtos.ReservaDTO;

import jakarta.transaction.Transactional;

@Service
public class ReservaService {

    @Autowired
    private IReservaRepository reservaRepo;
    @Autowired
    private IUsuarioRepository usuarioRepo;
    @Autowired
    private IAlojamientoRepository alojamientoRepo;

    //Crear reserva
    @Transactional
    public Reserva crearReserva(ReservaDTO dto, Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Alojamiento alojamiento = alojamientoRepo.findById(dto.getAlojamientoId())
            .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado"));

        if (dto.getHuespedes() > alojamiento.getCapacidadHuespedes()) {
            throw new RuntimeException("Excede la capacidad del alojamiento (" 
                + alojamiento.getCapacidadHuespedes() + " personas)");
        }

        if (dto.getCheckin().isBefore(LocalDate.now())) {
            throw new RuntimeException("La fecha de check-in no puede ser en el pasado");
        }

        if (dto.getCheckout().isBefore(dto.getCheckin())) {
            throw new RuntimeException("La fecha de check-out debe ser posterior al check-in");
        }

        List<Reserva> conflictos = reservaRepo.findReservasEnRango(
            dto.getAlojamientoId(), 
            dto.getCheckin(), 
            dto.getCheckout()
        );

        if (!conflictos.isEmpty()) {
            throw new RuntimeException("El alojamiento no está disponible en esas fechas");
        }

        long noches = ChronoUnit.DAYS.between(dto.getCheckin(), dto.getCheckout());
        if (noches < 1) {
            throw new RuntimeException("La reserva debe ser de al menos 1 noche");
        }
        Double importe = noches * alojamiento.getPrecioNoche();

        Reserva reserva = new Reserva();
        reserva.setId(new ReservaId(usuarioId, dto.getAlojamientoId()));
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

    //Modificar rserva
    @Transactional
    public Reserva modificarReserva(Long usuarioId, Long alojamientoId, 
                                    LocalDate nuevoCheckin, LocalDate nuevoCheckout,
                                    Integer nuevosHuespedes) {
        
        ReservaId id = new ReservaId(usuarioId, alojamientoId);
        Reserva reserva = reservaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        // Validar que falten más de 48 horas
        long horasRestantes = ChronoUnit.HOURS.between(LocalDate.now().atStartOfDay(), 
                                                       reserva.getCheckin().atStartOfDay());
        if (horasRestantes < 48) {
            throw new RuntimeException("No se puede modificar con menos de 48 horas de anticipación");
        }

        // Validar nueva disponibilidad
        List<Reserva> conflictos = reservaRepo.findReservasEnRango(
            alojamientoId, nuevoCheckin, nuevoCheckout
        );
        
        // Excluir la reserva actual
        conflictos.removeIf(r -> r.getId().equals(id));

        if (!conflictos.isEmpty()) {
            throw new RuntimeException("Las nuevas fechas no están disponibles");
        }

        // Validar capacidad
        if (nuevosHuespedes > reserva.getAlojamiento().getCapacidadHuespedes()) {
            throw new RuntimeException("Excede la capacidad del alojamiento");
        }

        // Actualizar
        reserva.setCheckin(nuevoCheckin);
        reserva.setCheckout(nuevoCheckout);
        reserva.setHuespedes(nuevosHuespedes);
        reserva.setFechaModificacion(LocalDate.now());

        // Recalcular importe
        long noches = ChronoUnit.DAYS.between(nuevoCheckin, nuevoCheckout);
        reserva.setImporte(noches * reserva.getAlojamiento().getPrecioNoche());

        return reservaRepo.save(reserva);
    }

    //Cancelar reserva
    @Transactional
    public void cancelarReserva(Long usuarioId, Long alojamientoId) {
        ReservaId id = new ReservaId(usuarioId, alojamientoId);
        Reserva reserva = reservaRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        long horasRestantes = ChronoUnit.HOURS.between(LocalDate.now().atStartOfDay(), 
                                                       reserva.getCheckin().atStartOfDay());
        if (horasRestantes < 48) {
            throw new RuntimeException("No se puede cancelar con menos de 48 horas de anticipación");
        }

        reservaRepo.delete(reserva);
    }

    //Historial
    public List<Reserva> obtenerHistorialUsuario(Long usuarioId) {
        return reservaRepo.findByUsuarioId(usuarioId);
    }

    
    public List<Reserva> obtenerHistorialAlojamiento(Long alojamientoId) {
        return reservaRepo.findByAlojamientoId(alojamientoId);
    }

    // Obtener reservas pasadas de un usuario
    public List<Reserva> obtenerReservasPasadas(Long usuarioId) {
        return reservaRepo.findReservasPasadas(usuarioId, LocalDate.now());
    }

    //Verificar disponibilidad en tiempo real
    public boolean verificarDisponibilidad(Long alojamientoId, 
                                           LocalDate checkin, 
                                           LocalDate checkout) {
        List<Reserva> conflictos = reservaRepo.findReservasEnRango(
            alojamientoId, checkin, checkout
        );
        return conflictos.isEmpty();
    }
}
