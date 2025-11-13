const API_BASE_URL_MOD = "http://localhost:8080";

let alojamientoIdMod = null;
let usuarioActualMod = null;
let reservaActual = null;

document.addEventListener("DOMContentLoaded", async () => {
  cargarUsuarioActual();

  if (!usuarioActualMod) {
    alert("Debes iniciar sesión");
    window.location.href = "/pages/autenticacion/login/login.html";
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  alojamientoIdMod = urlParams.get("alojamientoId");

  if (!alojamientoIdMod) {
    alert("No se especificó un alojamiento");
    window.location.href = "/index.html";
    return;
  }

  await cargarDatosReserva();
  configurarBotones();
});

function cargarUsuarioActual() {
  const userData = localStorage.getItem("usuario"); // ✅ CAMBIADO a localStorage
  if (userData) {
    usuarioActualMod = JSON.parse(userData);
  }
}

async function cargarDatosReserva() {
  try {
    const response = await fetch(
      `${API_BASE_URL_MOD}/reservas/historial/usuario/${usuarioActualMod.id}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al cargar reservas");

    const reservas = await response.json();
    reservaActual = reservas.find((r) => r.alojamientoId == alojamientoIdMod);

    if (!reservaActual) {
      alert("No tienes una reserva activa en este alojamiento");
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdMod}`;
      return;
    }

    await cargarAlojamiento();
    mostrarDatosReserva();
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar la reserva");
  }
}

async function cargarAlojamiento() {
  try {
    const response = await fetch(
      `${API_BASE_URL_MOD}/alojamientos/getAlojamiento/${alojamientoIdMod}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Error al cargar alojamiento");

    const alojamiento = await response.json();
    mostrarDatosAlojamiento(alojamiento);
  } catch (error) {
    console.error("Error:", error);
  }
}

function mostrarDatosAlojamiento(alojamiento) {
  const direccion = alojamiento.direccion;
  const direccionCompleta = `${direccion?.calle || ""} ${
    direccion?.numero || ""
  }, ${direccion?.ciudad?.nombre || ""}`;

  document.querySelector(".propiedad-nombre").textContent = alojamiento.nombre;
  document.querySelector(".propiedad-direccion").textContent =
    direccionCompleta;
  document.querySelector(
    ".propiedad-precio"
  ).textContent = `$${alojamiento.precioNoche} / noche`;
  document.querySelector(
    ".propiedad-dueño"
  ).textContent = `Anfitrión: ${alojamiento.anfitrionNombre} ${alojamiento.anfitrionApellido}`;

  const img = document.querySelector(".propiedad-imagen img");
  if (img && alojamiento.imagen) {
    img.src = alojamiento.imagen;
    img.alt = alojamiento.nombre;
  }
}

function mostrarDatosReserva() {
  const fechaCreacion = new Date(reservaActual.fechaCreacion);
  const limite48h = new Date(fechaCreacion.getTime() + 48 * 60 * 60 * 1000);
  const ahora = new Date();
  const puedeModificar = ahora < limite48h;

  const mensaje = document.querySelector("main p");
  if (puedeModificar) {
    const horasRestantes = Math.ceil((limite48h - ahora) / (1000 * 60 * 60));
    mensaje.textContent = `Tienes ${horasRestantes} horas para modificar o cancelar la reserva`;
  } else {
    mensaje.textContent = "El plazo para modificar la reserva ha expirado";
    mensaje.style.color = "#e53e3e";
  }

  const detallesReserva = document.createElement("div");
  detallesReserva.className = "detalles-reserva";
  detallesReserva.innerHTML = `
    <h3>Detalles de tu reserva</h3>
    <p><strong>Check-in:</strong> ${formatearFecha(reservaActual.checkin)}</p>
    <p><strong>Check-out:</strong> ${formatearFecha(reservaActual.checkout)}</p>
    <p><strong>Huéspedes:</strong> ${reservaActual.huespedes}</p>
    <p><strong>Importe total:</strong> $${
      reservaActual.importe || "Por calcular"
    }</p>
  `;

  const main = document.querySelector("main");
  main.insertBefore(
    detallesReserva,
    document.querySelector(".buttons-container")
  );
}

function configurarBotones() {
  const btnConfirmar = document.querySelector(
    '[data-target="/pages/alojamiento/alojamiento.html"]'
  );
  const btnModificar = document.querySelector(
    '[data-target="/pages/alojamiento/formularioReserva/formularioReserva.html"]'
  );

  if (btnConfirmar) {
    btnConfirmar.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdMod}`;
    });
  }

  if (btnModificar) {
    btnModificar.textContent = "Cancelar reserva";
    btnModificar.removeAttribute("data-target");
    btnModificar.addEventListener("click", cancelarReserva);
  }
}

async function cancelarReserva(e) {
  e.preventDefault();

  if (!confirm("¿Estás seguro de cancelar esta reserva?")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL_MOD}/reservas/cancelarReserva/usuario/${usuarioActualMod.id}/alojamiento/${alojamientoIdMod}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    alert("Reserva cancelada exitosamente");
    window.location.href = `/pages/alojamiento/alojamiento.html?id=${alojamientoIdMod}`;
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cancelar la reserva: " + error.message);
  }
}

function formatearFecha(fecha) {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
