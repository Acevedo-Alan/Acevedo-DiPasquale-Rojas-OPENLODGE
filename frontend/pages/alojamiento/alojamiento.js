const API_BASE_URL_ALOJ = "http://localhost:8080";

let alojamientoActual = null;
let usuarioActual = null;
let reservaActual = null;

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
    // Obtener el token si está autenticado
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

    console.log("Alojamiento cargado:", alojamientoActual);
    console.log("Usuario actual:", usuarioActual);
    console.log("¿Es anfitrión?", usuarioActual?.id === alojamientoActual.anfitrionId);

    // Verificar si el usuario tiene una reserva activa
    if (usuarioActual && usuarioActual.id) {
      await verificarReservaUsuario(usuarioActual.id, id);
    }

    mostrarAlojamiento(alojamientoActual);
    await verificarDisponibilidad(id);
    await mostrarCalendarioDisponibilidad(id);
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar el alojamiento");
    window.location.href = "/pages/index/index.html";
  }
}

async function verificarReservaUsuario(usuarioId, alojamientoId) {
  try {
    const headers = {
      "Content-Type": "application/json"
    };
    
    if (usuarioActual && usuarioActual.token) {
      headers["Authorization"] = `Bearer ${usuarioActual.token}`;
    }

    const response = await fetch(
      `${API_BASE_URL_ALOJ}/reservas/historial/usuario/${usuarioId}`,
      {
        method: "GET",
        credentials: "include",
        headers: headers,
      }
    );

    if (response.ok) {
      const reservas = await response.json();
      // Buscar reserva activa para este alojamiento
      reservaActual = reservas.find(
        (r) =>
          r.alojamientoId == alojamientoId && new Date(r.checkout) >= new Date()
      );
    }
  } catch (error) {
    console.error("Error al verificar reserva:", error);
  }
}

function mostrarAlojamiento(alojamiento) {
  const esAnfitrion =
    usuarioActual && 
    usuarioActual.id && 
    alojamiento.anfitrionId && 
    usuarioActual.id === alojamiento.anfitrionId;
  
  console.log("Mostrando alojamiento. Es anfitrión:", esAnfitrion);
  
  const vistaAnfitrion = document.getElementById("vista-anfitrion");
  const vistaHuesped = document.getElementById("vista-huesped");

  if (esAnfitrion) {
    if (vistaAnfitrion) vistaAnfitrion.style.display = "block";
    if (vistaHuesped) vistaHuesped.style.display = "none";
    llenarDatosVista(vistaAnfitrion, alojamiento);
  } else {
    if (vistaHuesped) vistaHuesped.style.display = "block";
    if (vistaAnfitrion) vistaAnfitrion.style.display = "none";
    llenarDatosVista(vistaHuesped, alojamiento);
  }

  configurarBotones(esAnfitrion);
}

function llenarDatosVista(vista, alojamiento) {
  const direccion = alojamiento.direccion;
  const ciudad = direccion?.ciudad || "";
  const pais = direccion?.pais || "";
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
  ).textContent = `$${alojamiento.precioNoche} / noche`;

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
      `${API_BASE_URL_ALOJ}/alojamientos/disponibilidad/${alojamientoId}`,
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

async function mostrarCalendarioDisponibilidad(alojamientoId) {
  try {
    const response = await fetch(
      `${API_BASE_URL_ALOJ}/alojamientos/disponibilidad/${alojamientoId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) return;

    const reservas = await response.json();

    // Crear elemento de calendario si no existe
    const calendarioBtn = document.querySelectorAll(
      ".calendario-disponibilidad"
    );
    calendarioBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        mostrarModalCalendario(reservas);
      });
    });
  } catch (error) {
    console.error("Error al cargar calendario:", error);
  }
}

function mostrarModalCalendario(reservas) {
  const modal = document.createElement("div");
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  const contenido = document.createElement("div");
  contenido.style.cssText = `
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 600px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  let html = "<h3>Calendario de Reservas</h3>";

  if (reservas.length === 0) {
    html += "<p>No hay reservas para este alojamiento</p>";
  } else {
    html += '<ul style="list-style: none; padding: 0;">';
    reservas.forEach((reserva) => {
      const checkin = new Date(reserva.checkin).toLocaleDateString("es-ES");
      const checkout = new Date(reserva.checkout).toLocaleDateString("es-ES");
      html += `
        <li style="padding: 1rem; border-bottom: 1px solid #eee;">
          <strong>Del ${checkin} al ${checkout}</strong><br>
          Huéspedes: ${reserva.huespedes}
        </li>
      `;
    });
    html += "</ul>";
  }

  html +=
    '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Cerrar</button>';

  contenido.innerHTML = html;
  modal.appendChild(contenido);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}

function configurarBotones(esAnfitrion) {
  console.log("Configurando botones. Es anfitrión:", esAnfitrion);
  
  if (esAnfitrion) {
    // Configurar botón eliminar
    const btnEliminar = document.querySelector(".eliminar-popup");
    console.log("Botón eliminar encontrado:", btnEliminar);
    if (btnEliminar) {
      btnEliminar.addEventListener("click", eliminarAlojamiento);
    }

    // Configurar botón modificar - buscar por diferentes selectores
    const btnModificar = document.querySelector(
      '#vista-anfitrion [data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    ) || document.querySelector('#vista-anfitrion .btn-modificar') 
       || document.querySelector('#vista-anfitrion button[type="button"]');
    
    console.log("Botón modificar encontrado:", btnModificar);
    
    if (btnModificar) {
      btnModificar.textContent = "Modificar alojamiento";
      btnModificar.removeAttribute("data-target");
      btnModificar.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `/pages/modificarPropiedad/modificarPropiedad.html?id=${alojamientoActual.id}`;
      });
    }
  } else {
    // Configuración para huéspedes
    const btnReservar = document.querySelector(
      '[data-target="/pages/alojamiento/formularioReserva/formularioReserva.html"]'
    );
    if (btnReservar) {
      btnReservar.addEventListener("click", (e) => {
        e.preventDefault();
        if (!usuarioActual || !usuarioActual.id) {
          alert("Debes iniciar sesión para reservar");
          window.location.href = "/pages/autenticacion/login/login.html";
        } else {
          window.location.href = `/pages/alojamiento/formularioReserva/formularioReserva.html?alojamientoId=${alojamientoActual.id}`;
        }
      });
    }

    // Mostrar/ocultar botón "Modificar reserva" según si tiene reserva activa
    const btnModificarReserva = document.querySelector(
      '#vista-huesped [data-target="/pages/alojamiento/modificarReserva/modificarReserva.html"]'
    );

    if (btnModificarReserva) {
      if (reservaActual) {
        btnModificarReserva.style.display = "inline-block";
        btnModificarReserva.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = `/pages/alojamiento/modificarReserva/modificarReserva.html?alojamientoId=${alojamientoActual.id}`;
        });
      } else {
        btnModificarReserva.style.display = "none";
      }
    }
  }
}

async function eliminarAlojamiento() {
  if (!confirm("¿Estás seguro de eliminar este alojamiento?")) return;

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