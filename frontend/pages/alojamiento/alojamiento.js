const API_BASE_URL_ALOJ = "http://localhost:8080";

let alojamientoActual = null;
let usuarioActual = null;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alojamientoId = urlParams.get("id");

  if (!alojamientoId) {
    alert("No se especificó un alojamiento");
    window.location.href = "/pages/index/index.html";
    return;
  }

  await cargarUsuarioActual();
  await cargarAlojamiento(alojamientoId);
});

async function cargarUsuarioActual() {
  const userData = localStorage.getItem("usuario");
  if (userData) {
    usuarioActual = JSON.parse(userData);
  }
}

async function cargarAlojamiento(id) {
  try {
    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/getAlojamiento/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error("Alojamiento no encontrado");

    alojamientoActual = await response.json();
    mostrarAlojamiento(alojamientoActual);
    await verificarDisponibilidad(id);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar el alojamiento");
    window.location.href = "/index.html";
  }
}

function mostrarAlojamiento(alojamiento) {
  const esAnfitrion =
    usuarioActual && usuarioActual.id === alojamiento.anfitrionId;
  const vistaAnfitrion = document.getElementById("vista-anfitrion");
  const vistaHuesped = document.getElementById("vista-huesped");

  if (esAnfitrion) {
    vistaAnfitrion.style.display = "block";
    vistaHuesped.style.display = "none";
    llenarDatosVista(vistaAnfitrion, alojamiento);
  } else {
    vistaHuesped.style.display = "block";
    vistaAnfitrion.style.display = "none";
    llenarDatosVista(vistaHuesped, alojamiento);
  }

  configurarBotones(esAnfitrion);
}

function llenarDatosVista(vista, alojamiento) {
  const direccion = alojamiento.direccion;
  const ciudad = direccion?.ciudad?.nombre || "";
  const pais = direccion?.ciudad?.pais?.nombre || "";
  const calle = direccion?.calle || "";
  const numero = direccion?.numero || "";

  vista.querySelector("#nombre-propiedad").textContent = alojamiento.nombre;
  vista.querySelector("#localidad").textContent = `${ciudad}${
    pais ? ", " + pais : ""
  }`;
  vista.querySelector("#direccion").textContent = `${calle} ${numero}`;
  vista.querySelector(
    "#nombre-anfitrion"
  ).textContent = `Anfitrión: ${alojamiento.anfitrionNombre} ${alojamiento.anfitrionApellido}`;
  vista.querySelector(
    "#precio-propiedad"
  ).textContent = `${alojamiento.precioNoche} / noche`;

  const serviciosContainer = vista.querySelector("#servicios-alojamiento");
  serviciosContainer.innerHTML = "";

  if (alojamiento.servicios && alojamiento.servicios.length > 0) {
    alojamiento.servicios.forEach((servicio) => {
      const div = document.createElement("div");
      div.className = "servicio-item";
      div.textContent = servicio.nombre;
      serviciosContainer.appendChild(div);
    });
  } else {
    serviciosContainer.innerHTML = "<p>No hay servicios disponibles</p>";
  }

  const carrusel = vista.querySelector(".carrusel");
  if (carrusel && alojamiento.imagen) {
    carrusel.innerHTML = `<img src="${alojamiento.imagen}" alt="${alojamiento.nombre}" 
                              style="width: 100%; max-height: 400px; object-fit: cover;">`;
  }
}

async function verificarDisponibilidad(alojamientoId) {
  try {
    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/getAlojamiento/disponibilidad/${alojamientoId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.ok) {
      const reservas = await response.json();
      const disponibilidadText =
        reservas.length === 0 ? "Disponible" : "Reservado";
      document.querySelectorAll("#disponibilidad").forEach((elem) => {
        elem.textContent = `Estado: ${disponibilidadText}`;
      });
    }
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
  }
}

function configurarBotones(esAnfitrion) {
  if (esAnfitrion) {
    const btnEliminar = document.querySelector(".eliminar-popup");
    if (btnEliminar) {
      btnEliminar.addEventListener("click", eliminarAlojamiento);
    }

    const btnModificar = document.querySelector(
      '[data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    );
    if (btnModificar) {
      btnModificar.textContent = "Modificar alojamiento";
      btnModificar.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/pages/modificarPropiedad/modificarPropiedad.html?id=${alojamientoActual.id}`;
      });
    }
  } else {
    const btnReservar = document.querySelector(
      '[data-target="/pages/alojamiento/formularioReserva/formularioReserva.html"]'
    );
    if (btnReservar) {
      btnReservar.addEventListener("click", (e) => {
        e.preventDefault();
        if (!usuarioActual) {
          alert("Debes iniciar sesión para reservar");
          window.location.href = "/pages/autenticacion/login/login.html";
        } else {
          window.location.href = `/pages/alojamiento/formularioReserva/formularioReserva.html?alojamientoId=${alojamientoActual.id}`;
        }
      });
    }
  }
}

async function eliminarAlojamiento() {
  if (!confirm("¿Estás seguro de eliminar este alojamiento?")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/eliminarAlojamiento/${alojamientoActual.id}?anfitrionId=${usuarioActual.id}`,
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

    alert("Alojamiento eliminado exitosamente");
    window.location.href = "/pages/index/index.html";
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar el alojamiento: " + error.message);
  }
}

