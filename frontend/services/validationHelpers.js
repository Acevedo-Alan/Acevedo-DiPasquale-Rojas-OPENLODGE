// validationHelpers.js - Funciones de validación compartidas

const validationHelpers = {
  /**
   * Valida que una fecha sea futura o presente
   */
  isValidDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  },

  /**
   * Valida que la fecha de fin sea posterior a la fecha de inicio
   */
  isValidDateRange(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) return false;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return fin > inicio;
  },

  /**
   * Valida que el número de huéspedes sea válido
   */
  isValidGuestCount(count, maxCapacity = null) {
    if (!count || count < 1) return false;
    if (maxCapacity && count > maxCapacity) return false;
    return true;
  },

  /**
   * Valida una contraseña (mínimo 6 caracteres)
   */
  validatePassword(password) {
    if (!password || password.length < 6) {
      return {
        valid: false,
        message: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    return { valid: true, message: "" };
  },

  /**
   * Valida un email
   */
  validateEmail(email) {
    if (!email) {
      return { valid: false, message: "El email es requerido" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "El formato del email no es válido" };
    }

    return { valid: true, message: "" };
  },

  /**
   * Valida los datos de una reserva
   */
  validateReservationData(data, alojamiento = null) {
    const errors = [];

    // Validar fechas
    if (!data.fechaInicio || !data.fechaFin) {
      errors.push("Las fechas de inicio y fin son requeridas");
    } else {
      if (!this.isValidDate(data.fechaInicio)) {
        errors.push("La fecha de inicio debe ser presente o futura");
      }

      if (!this.isValidDate(data.fechaFin)) {
        errors.push("La fecha de fin debe ser futura");
      }

      if (!this.isValidDateRange(data.fechaInicio, data.fechaFin)) {
        errors.push("La fecha de fin debe ser posterior a la fecha de inicio");
      }
    }

    // Validar huéspedes
    if (!data.huespedes || data.huespedes < 1) {
      errors.push("Debe haber al menos 1 huésped");
    } else if (alojamiento && alojamiento.capacidadHuespedes) {
      if (data.huespedes > alojamiento.capacidadHuespedes) {
        errors.push(
          `El número de huéspedes excede la capacidad máxima (${alojamiento.capacidadHuespedes})`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  },

  /**
   * Configura validación de fechas en inputs de tipo date
   */
  setupDateValidation(fechaInicioId, fechaFinId) {
    const fechaInicio = document.getElementById(fechaInicioId);
    const fechaFin = document.getElementById(fechaFinId);

    if (!fechaInicio || !fechaFin) return;

    const hoy = new Date().toISOString().split("T")[0];
    fechaInicio.min = hoy;
    fechaFin.min = hoy;

    fechaInicio.addEventListener("change", () => {
      if (fechaInicio.value) {
        fechaFin.min = fechaInicio.value;
        // Si la fecha fin es anterior a la nueva fecha inicio, limpiarla
        if (fechaFin.value && fechaFin.value <= fechaInicio.value) {
          fechaFin.value = "";
        }
      }
    });
  },
};

// Exportar para uso global
window.validationHelpers = validationHelpers;

