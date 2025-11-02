document.addEventListener("DOMContentLoaded", async () => {
  const alojamientoId = sessionStorage.getItem("alojamientoId");
  const userId = localStorage.getItem("userId");

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

  await cargarServiciosDisponibles(alojamientoId);
  setupFormulario(alojamientoId, userId);
  setupValidacionFechas();
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

function setupFormulario(alojamientoId, userId) {
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

    // Validar fechas
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      alert("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    // Verificar disponibilidad
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

    const reservaData = {
      alojamientoId: parseInt(alojamientoId),
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      cantidadHuespedes: huespedes,
      servicios: serviciosSeleccionados,
    };

    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = "Procesando...";
      submitBtn.disabled = true;

      await apiService.crearReserva(userId, reservaData);

      mostrarPopup("¡Reserva realizada con éxito!");

      setTimeout(() => {
        window.location.href = "/pages/alojamiento/alojamiento.html";
      }, 2000);
    } catch (error) {
      console.error("Error al crear reserva:", error);
      alert("Error al crear la reserva: " + error.message);

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = "Reservar";
      submitBtn.disabled = false;
    }
  });
}

function setupValidacionFechas() {
  const fechaInicio = document.getElementById("fecha-inicio");
  const fechaFin = document.getElementById("fecha-fin");

  if (!fechaInicio || !fechaFin) return;

  const hoy = new Date().toISOString().split("T")[0];
  fechaInicio.min = hoy;
  fechaFin.min = hoy;

  fechaInicio.addEventListener("change", () => {
    fechaFin.min = fechaInicio.value;
  });
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
