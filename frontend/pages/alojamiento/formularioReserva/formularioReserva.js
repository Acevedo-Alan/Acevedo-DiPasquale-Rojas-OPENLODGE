document.addEventListener("DOMContentLoaded", async () => {
  const alojamientoId = sessionStorage.getItem("alojamientoId");
  const userId = localStorage.getItem("userId");
  const modificandoReserva = sessionStorage.getItem("modificandoReserva") === "true";

  if (!alojamientoId) {
    alert("No se especificó un alojamiento para reservar");
    window.location.href = "/pages/index/index.html";
    return;
  }

  if (!userId) {
    alert("Debes iniciar sesión para hacer una reserva");
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  // Cargar datos del alojamiento para validaciones
  let alojamiento = null;
  try {
    alojamiento = await apiService.getAlojamientoById(alojamientoId);
  } catch (error) {
    console.error("Error al cargar alojamiento:", error);
  }

  await cargarServiciosDisponibles(alojamientoId);
  setupFormulario(alojamientoId, userId, modificandoReserva, alojamiento);
  setupValidacionFechas();
  
  // Si estamos modificando, precargar datos de la reserva
  if (modificandoReserva) {
    await precargarDatosReserva(alojamientoId, userId);
  }
});

async function cargarServiciosDisponibles(alojamientoId) {
  try {
    const alojamiento = await apiService.getAlojamientoById(alojamientoId);
    const contenedorServicios = document.querySelector(".servicios");

    if (!contenedorServicios) return;

    contenedorServicios.innerHTML = "";

    if (!alojamiento.servicios || alojamiento.servicios.length === 0) {
      contenedorServicios.innerHTML =
        "<p>No hay servicios adicionales disponibles</p>";
      return;
    }

    alojamiento.servicios.forEach((servicio) => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "servicios";
      checkbox.value = servicio.id || servicio.nombre;

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${servicio.nombre}`));
      label.appendChild(document.createElement("br"));

      contenedorServicios.appendChild(label);
    });
  } catch (error) {
    console.error("Error al cargar servicios:", error);
  }
}

async function precargarDatosReserva(alojamientoId, userId) {
  try {
    const reservaGuardada = sessionStorage.getItem("reservaActual");
    if (!reservaGuardada) return;

    const reserva = JSON.parse(reservaGuardada);
    
    // Verificar que la reserva corresponde al alojamiento
    if (reserva.alojamiento?.id != alojamientoId) return;

    // Prellenar campos del formulario
    const fechaInicio = document.getElementById("fecha-inicio");
    const fechaFin = document.getElementById("fecha-fin");
    const huespedes = document.getElementById("huespedes");

    if (fechaInicio && reserva.checkin) {
      fechaInicio.value = reserva.checkin.split("T")[0];
    }
    if (fechaFin && reserva.checkout) {
      fechaFin.value = reserva.checkout.split("T")[0];
    }
    if (huespedes && reserva.huespedes) {
      huespedes.value = reserva.huespedes;
    }

    // Cambiar texto del botón
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = "Modificar Reserva";
    }
  } catch (error) {
    console.error("Error al precargar datos de reserva:", error);
  }
}

function setupFormulario(alojamientoId, userId, modificandoReserva = false, alojamiento = null) {
  const form = document.getElementById("form-reserva");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fechaInicio = document.getElementById("fecha-inicio").value;
    const fechaFin = document.getElementById("fecha-fin").value;
    const huespedes = parseInt(document.getElementById("huespedes").value);
    const terminos = document.getElementById("terminos").checked;

    if (!terminos) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    // Validar fechas usando helper compartido
    const validationResult = validationHelpers.validateReservationData(
      {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        huespedes: huespedes,
      },
      alojamiento // pasar alojamiento para validar capacidad
    );

    if (!validationResult.valid) {
      alert(validationResult.errors.join("\n"));
      return;
    }

    // Verificar disponibilidad (excepto si estamos modificando la misma reserva)
    try {
      const disponibilidad = await apiService.verificarDisponibilidad(
        alojamientoId,
        fechaInicio,
        fechaFin
      );

      if (!disponibilidad.disponible) {
        alert("El alojamiento no está disponible en las fechas seleccionadas");
        return;
      }
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      alert("Error al verificar disponibilidad");
      return;
    }

    // Obtener servicios seleccionados
    const serviciosSeleccionados = Array.from(
      document.querySelectorAll('input[name="servicios"]:checked')
    ).map((cb) => cb.value);

    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = modificandoReserva ? "Modificando..." : "Procesando...";
      submitBtn.disabled = true;

      if (modificandoReserva) {
        // Modificar reserva existente
        await apiService.modificarReserva(userId, alojamientoId, {
          nuevoCheckin: fechaInicio,
          nuevoCheckout: fechaFin,
          nuevosHuespedes: huespedes,
        });

        mostrarPopup("¡Reserva modificada con éxito!");
        sessionStorage.removeItem("modificandoReserva");
        sessionStorage.removeItem("reservaActual");

        setTimeout(() => {
          window.location.href = "/pages/alojamiento/modificarReserva/modificarReserva.html";
        }, 2000);
      } else {
        // Crear nueva reserva
        const reservaData = {
          alojamientoId: parseInt(alojamientoId),
          fechaInicio: fechaInicio,
          fechaFin: fechaFin,
          cantidadHuespedes: huespedes,
          servicios: serviciosSeleccionados,
        };

        await apiService.crearReserva(userId, reservaData);

        mostrarPopup("¡Reserva realizada con éxito!");

        setTimeout(() => {
          window.location.href = "/pages/alojamiento/alojamiento.html";
        }, 2000);
      }
    } catch (error) {
      console.error("Error al procesar reserva:", error);
      alert("Error: " + error.message);

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = modificandoReserva ? "Modificar Reserva" : "Reservar";
      submitBtn.disabled = false;
    }
  });
}

function setupValidacionFechas() {
  // Usar helper compartido para validación de fechas
  validationHelpers.setupDateValidation("fecha-inicio", "fecha-fin");
}

function mostrarPopup(mensaje) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const popup = document.createElement("div");
  popup.style.cssText = `
    background: #fff;
    padding: 25px 35px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    text-align: center;
    font-family: Arial, sans-serif;
  `;

  popup.innerHTML = `
    <h2 style="color:#059669; margin-bottom:10px;">${mensaje}</h2>
    <p>Gracias por tu reserva.</p>
    <button id="cerrar-popup" style="
      margin-top:15px;
      background-color:#059669;
      color:white;
      border:none;
      padding:10px 20px;
      border-radius:8px;
      cursor:pointer;
      font-size:16px;
    ">Aceptar</button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  document.getElementById("cerrar-popup").addEventListener("click", () => {
    overlay.remove();
  });
}
