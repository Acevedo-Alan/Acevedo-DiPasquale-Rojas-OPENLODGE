const API_BASE_URL_RESERVA = "http://localhost:8080";

let alojamientoId = null;
let usuarioActual = null;
let serviciosDisponibles = [];

document.addEventListener("DOMContentLoaded", async () => {
  cargarUsuarioActual();

  if (!usuarioActual || !usuarioActual.id) {
    alert("Debes iniciar sesión para reservar");
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  alojamientoId = urlParams.get("alojamientoId");

  if (!alojamientoId) {
    alert("No se especificó un alojamiento");
    window.location.href = "/pages/index/index.html";
    return;
  }

  await cargarServicios();
  configurarFormulario();
  configurarValidacionFechas();
});

function cargarUsuarioActual() {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActual = JSON.parse(userData);
  }
}

async function cargarServicios() {
  try {
    const response = await fetch(`${API_BASE_URL_RESERVA}/servicios/getAll`, {
      method: "GET",
      credentials: "include",
      headers: { 
        "Content-Type": "application/json"
      },
    });

    if (response.ok) {
      serviciosDisponibles = await response.json();
      mostrarServiciosEnFormulario();
    } else {
      console.error("Error al cargar servicios desde la base de datos");
      // Fallback a servicios predefinidos
      usarServiciosPredefinidos();
    }
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    usarServiciosPredefinidos();
  }
}

function usarServiciosPredefinidos() {
  serviciosDisponibles = [
    { id: 1, nombre: "WiFi" },
    { id: 2, nombre: "Desayuno" },
    { id: 3, nombre: "Pileta" },
    { id: 4, nombre: "Cochera" },
  ];
  mostrarServiciosEnFormulario();
}

function mostrarServiciosEnFormulario() {
  const serviciosContainer = document.querySelector(".servicios");
  
  if (!serviciosContainer) {
    console.error("No se encontró el contenedor de servicios");
    return;
  }

  // Limpiar servicios existentes (por si hay HTML estático)
  serviciosContainer.innerHTML = "";

  if (serviciosDisponibles.length === 0) {
    serviciosContainer.innerHTML = "<p>No hay servicios disponibles</p>";
    return;
  }

  serviciosDisponibles.forEach((servicio) => {
    const label = document.createElement("label");
    label.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    `;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "servicios";
    checkbox.value = servicio.id;
    checkbox.dataset.nombre = servicio.nombre;

    const span = document.createElement("span");
    span.textContent = servicio.nombre;

    label.appendChild(checkbox);
    label.appendChild(span);
    serviciosContainer.appendChild(label);
  });
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

  // Obtener servicios seleccionados (opcional, por si quieres enviarlos)
  const serviciosSeleccionados = Array.from(
    document.querySelectorAll('input[name="servicios"]:checked')
  ).map((checkbox) => parseInt(checkbox.value));

  const reservaData = {
    alojamientoId: parseInt(alojamientoId),
    checkin: fechaInicio,
    checkout: fechaFin,
    huespedes: huespedes,
    // Si tu ReservaDTO incluye servicios, descomenta la siguiente línea:
    // serviciosId: serviciosSeleccionados
  };

  try {
    const response = await fetch(
      `${API_BASE_URL_RESERVA}/reservas/crearReserva`,
      {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActual.token}`
        },
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
    // Usar el endpoint público de verificación de disponibilidad
    const response = await fetch(
      `${API_BASE_URL_RESERVA}/reservas/disponibilidad/${alojamientoId}?checkin=${checkin}&checkout=${checkout}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      console.error("Error al verificar disponibilidad:", response.status);
      throw new Error("Error al verificar disponibilidad");
    }

    const resultado = await response.json();
    console.log("Resultado de disponibilidad:", resultado);
    
    // El endpoint devuelve { disponible: boolean }
    return resultado.disponible;
  } catch (error) {
    console.error("Error:", error);
    // En caso de error, asumir no disponible por seguridad
    return false;
  }
}