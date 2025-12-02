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
    const headers = {
      "Content-Type": "application/json"
    };
    
    if (usuarioActual && usuarioActual.token) {
      headers["Authorization"] = `Bearer ${usuarioActual.token}`;
    }

    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: headers,
      }
    );

    if (!response.ok) throw new Error("Alojamiento no encontrado");

    alojamientoActual = await response.json();

    mostrarAlojamiento(alojamientoActual);

    await configurarCalendarioDisponibilidad(id);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar el alojamiento");
    window.location.href = "/pages/index/index.html";
  }
}

function mostrarAlojamiento(alojamiento) {
  const esAnfitrion =
    usuarioActual && 
    usuarioActual.id && 
    alojamiento.anfitrionId && 
    usuarioActual.id === alojamiento.anfitrionId;
  
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
  const direccion = alojamiento.direccion || {};
  const ciudadObj = direccion.ciudad || {};
  const paisObj = ciudadObj.pais || {};

  const ciudad = ciudadObj.nombre || "Ciudad no especificada";
  const pais = paisObj.nombre || "";
  const calle = direccion.calle || "";
  const numero = direccion.numero || "";

  vista.querySelector("#nombre-propiedad").textContent = alojamiento.nombre;
  vista.querySelector("#localidad").textContent = `${ciudad}${pais ? ", " + pais : ""}`;
  vista.querySelector("#direccion").textContent = `${calle} ${numero}`;

  vista.querySelector("#nombre-anfitrion").textContent =
    `Anfitrión: ${alojamiento.anfitrionNombre} ${alojamiento.anfitrionApellido}`;

  vista.querySelector("#precio-propiedad").textContent =
    `$${alojamiento.precioNoche} / noche`;

  const serviciosContainer = vista.querySelector("#servicios-alojamiento");
  serviciosContainer.innerHTML = "";

  if (alojamiento.servicios?.length > 0) {
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
    carrusel.innerHTML = `
      <img src="${alojamiento.imagen}" alt="${alojamiento.nombre}" 
           style="width: 100%; max-height: 400px; object-fit: cover;">
    `;
  }
}

async function configurarCalendarioDisponibilidad(alojamientoId) {
  try {
    const esAnfitrion =
      usuarioActual?.id &&
      alojamientoActual?.anfitrionId &&
      usuarioActual.id === alojamientoActual.anfitrionId;

    let reservas = [];

    const headersPublic = {
      "Content-Type": "application/json"
    };

    if (usuarioActual?.token) {
      headersPublic["Authorization"] = `Bearer ${usuarioActual.token}`;
    }

    const response = await fetch(
      `${API_BASE_URL_ALOJ}/reservas/fechas-ocupadas/${alojamientoId}`,
      {
        method: "GET",
        credentials: "include",
        headers: headersPublic
      }
    );

    if (response.ok) {
      const data = await response.json();

      reservas = data.map(r => ({
        fechaInicio: r.checkin,
        fechaFin: r.checkout,
        raw: r
      }));

    } else {
      console.error("Error al cargar fechas ocupadas:", response.status);
    }

    if (esAnfitrion && usuarioActual.token) {
      const responseHost = await fetch(
        `${API_BASE_URL_ALOJ}/reservas/historial/alojamiento/${alojamientoId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${usuarioActual.token}`
          }
        }
      );

      if (responseHost.ok) {
        const dataHost = await responseHost.json();

        reservas = dataHost.map(r => ({
          fechaInicio: r.checkin || r.fechaInicio,
          fechaFin: r.checkout || r.fechaFin,
          nombreHuesped: `${r.usuarioNombre || ""} ${r.usuarioApellido || ""}`.trim(),
          huespedes: r.huespedes,
          raw: r
        }));
      }
    }

    setTimeout(() => {
      configurarBotonesCalendario(reservas, esAnfitrion);
    }, 100);
    
  } catch (error) {
    console.error("Error al cargar calendario:", error);
    setTimeout(() => configurarBotonesCalendario([], false), 100);
  }
}

function configurarBotonesCalendario(reservas, esAnfitrion) {
  const calendarioBtns = document.querySelectorAll(".calendario-disponibilidad");
  
  calendarioBtns.forEach((btn) => {
    const nuevoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(nuevoBtn, btn);

    nuevoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarModalCalendario(reservas, esAnfitrion);
    });
  });
}

function mostrarModalCalendario(reservas, esAnfitrion) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; justify-content: center;
    align-items: center; z-index: 1000;
  `;

  const contenido = document.createElement("div");
  contenido.style.cssText = `
    background: white; padding: 2rem; border-radius: 8px;
    max-width: 600px; max-height: 80vh; overflow-y: auto;
  `;

  let html = "<h3>Calendario de Disponibilidad</h3>";

  if (!reservas || reservas.length === 0) {
    html += "<p>No hay reservas para este alojamiento. Está disponible.</p>";
  } else {
    html += "<ul style='list-style:none; padding:0;'>";

    reservas.forEach((r) => {
      const checkin = new Date(r.fechaInicio).toLocaleDateString("es-ES");
      const checkout = new Date(r.fechaFin).toLocaleDateString("es-ES");

      if (esAnfitrion) {
        html += `
          <li style="padding: 1rem; border-bottom: 1px solid #ddd;">
            <strong>Del ${checkin} al ${checkout}</strong><br>
            Huésped: ${r.nombreHuesped || "N/A"}<br>
            Cantidad de huéspedes: ${r.huespedes || "N/A"}
          </li>
        `;
      } else {
        html += `
          <li style="padding: 1rem; border-bottom: 1px solid #ddd;">
            <strong>Ocupado del ${checkin} al ${checkout}</strong>
          </li>
        `;
      }
    });

    html += "</ul>";
  }

  html += `
    <button onclick="this.closest('div[style*=fixed]').remove()"
      style="margin-top:1rem; padding:.75rem 1.5rem; background:#3182ce; color:white;
      border:none; border-radius:6px; cursor:pointer;">
      Cerrar
    </button>
  `;

  contenido.innerHTML = html;
  modal.appendChild(contenido);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

function configurarBotones(esAnfitrion) {
  if (esAnfitrion) {
    const btnEliminar = document.querySelector("#vista-anfitrion .eliminar-popup");
    if (btnEliminar) btnEliminar.addEventListener("click", eliminarAlojamiento);

    const btnModificar = document.querySelector(
      '#vista-anfitrion [data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    );
    
    if (btnModificar) {
      btnModificar.textContent = "Modificar alojamiento";
      btnModificar.removeAttribute("data-target");
      btnModificar.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/pages/modificarPropiedad/modificarPropiedad.html?id=${alojamientoActual.id}`;
      });
    }
  } else {
    // BOTÓN RESERVAR
    const btnReservar = document.querySelector(
      '#vista-huesped [data-target="/pages/alojamiento/formularioReserva/formularioReserva.html"]'
    );

    if (btnReservar) {
      btnReservar.addEventListener("click", (e) => {
        e.preventDefault();
        if (!usuarioActual?.id) {
          alert("Debes iniciar sesión para reservar");
          window.location.href = "/pages/autenticacion/login/login.html";
          return;
        }
        window.location.href = `/pages/alojamiento/formularioReserva/formularioReserva.html?alojamientoId=${alojamientoActual.id}`;
      });
    }

    // BOTÓN MODIFICAR RESERVA (HUÉSPED)
    const btnModificarReserva = document.querySelector(
      '#vista-huesped [data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    );

    if (btnModificarReserva) {
      btnModificarReserva.addEventListener("click", (e) => {
        e.preventDefault();
        if (!usuarioActual?.id) {
          alert("Debes iniciar sesión");
          window.location.href = "/pages/autenticacion/login/login.html";
          return;
        }
        window.location.href = `/pages/alojamiento/modificarReserva/modificarReserva.html?alojamientoId=${alojamientoActual.id}`;
      });
    }
  }
}

async function eliminarAlojamiento() {
  if (!confirm("¿Seguro de eliminar este alojamiento?")) return;

  try {
    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/eliminar/${alojamientoActual.id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${usuarioActual.token}`
        },
      }
    );

    if (!response.ok) throw new Error(await response.text());

    alert("Alojamiento eliminado");
    window.location.href = "/pages/index/index.html";
    
  } catch (error) {
    alert("Error al eliminar: " + error.message);
  }
}
