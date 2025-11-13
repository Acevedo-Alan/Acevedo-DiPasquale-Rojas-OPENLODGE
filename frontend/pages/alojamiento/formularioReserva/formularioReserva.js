const API_BASE_URL_RESERVA = "http://localhost:8080";

let alojamientoId = null;
let usuarioActual = null;

document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarioActual();

  if (!usuarioActual) {
    alert("Debes iniciar sesión para reservar");
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  alojamientoId = urlParams.get("alojamientoId");

  if (!alojamientoId) {
    alert("No se especificó un alojamiento");
    window.location.href = "/index.html";
    return;
  }

  configurarFormulario();
  configurarValidacionFechas();
});

function cargarUsuarioActual() {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActual = JSON.parse(userData);
  }
}

function configurarFormulario() {
  const form = document.getElementById("form-reserva");
  form.addEventListener("submit", handleSubmit);

  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha-inicio").min = hoy;
  document.getElementById("fecha-fin").min = hoy;
}

function configurarValidacionFechas() {
  const fechaInicio = document.getElementById("fecha-inicio");
  const fechaFin = document.getElementById("fecha-fin");

  fechaInicio.addEventListener("change", () => {
    fechaFin.min = fechaInicio.value;
    if (fechaFin.value && fechaFin.value <= fechaInicio.value) {
      fechaFin.value = "";
    }
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  const fechaInicio = document.getElementById("fecha-inicio").value;
  const fechaFin = document.getElementById("fecha-fin").value;
  const huespedes = parseInt(document.getElementById("huespedes").value);
  const terminos = document.getElementById("terminos").checked;

  if (!terminos) {
    alert("Debes aceptar los términos y condiciones");
    return;
  }

  if (new Date(fechaFin) <= new Date(fechaInicio)) {
    alert("La fecha de salida debe ser posterior a la fecha de entrada");
    return;
  }

  const disponible = await verificarDisponibilidad(fechaInicio, fechaFin);
  if (!disponible) {
    alert("El alojamiento no está disponible en las fechas seleccionadas");
    return;
  }

  const reservaData = {
    alojamientoId: parseInt(alojamientoId),
    checkin: fechaInicio,
    checkout: fechaFin,
    huespedes: huespedes,
  };

  try {
    const response = await fetch(
      `${API_BASE_URL_RESERVA}/reservas/crearReserva/usuario/${usuarioActual.id}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaData),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    alert("¡Reserva creada exitosamente!");
    window.location.href = `/pages/alojamiento/modificarReserva/modificarReserva.html?alojamientoId=${alojamientoId}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al crear la reserva: " + error.message);
  }
}

async function verificarDisponibilidad(checkin, checkout) {
  try {
    const response = await fetch(
      `${API_BASE_URL_RESERVA}/reservas/disponibilidad/${alojamientoId}?checkin=${checkin}&checkout=${checkout}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al verificar disponibilidad");

    const resultado = await response.json();
    return resultado.disponible;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
